const User = require("../../models/UserModel");
const Expense = require("../../models/ExpenseModel");
const Income = require("../../models/IncomeModel");
const Role = require("../../models/RoleModel");
const mongoose = require("mongoose");
const MonthSats = require("../../utils/MonthSatetUtil");

const UserDetails = async (req, res) => {
  try {
    const TotalUser = await User.find().populate("role");
    const usersWithExpenseCount = await Promise.all(
      TotalUser.map(async (user) => {
        const expenseCount = await Expense.countDocuments({
          userId: user._id,
        });
        const incomeCount = await Income.countDocuments({
          userId: user._id,
        });
        const ExpenseData = await Expense.find({
          userId: user._id,
        });
        const ExpenseAmount = ExpenseData.map((amount) => amount.amount);
        const TotalExpenseAmount = ExpenseAmount.reduce(
          (total, num) => total + num,
          0
        );
        return {
          ...user.toObject(),
          TotalExpenseAmount,
          expenseCount: expenseCount,
          incomeCount: incomeCount,
        };
      })
    );

    if (TotalUser.length > 0) {
      res.status(200).json(usersWithExpenseCount);
    } else {
      res.status(200).json("Not Have any User Details");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    const userId = req.user.id;

    const currentUser = await User.findById(userId).populate("role");

    // Check if the current user is an admin
    if (!currentUser || currentUser.role.name.toLowerCase() !== "admin") {
      return res.status(403).json({
        message: "Only administrators can change user roles",
      });
    }

    // Find the role document that matches the requested role name
    const roleDoc = await Role.findOne({ name: roleName.toLowerCase() });

    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Update the user's role with the role's _id
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: roleDoc._id },
      { new: true }
    ).populate("role");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User role updated successfully",
      data: {
        id: updatedUser._id,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error("Update User Role Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetAllUserMonthTotalExpenseorIncome = async (req, res) => {
  try {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const expenseAggregation = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$expenseDate" },
            month: { $month: "$expenseDate" },
          },
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const incomeAggregation = await Income.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$incomeDate" },
            month: { $month: "$incomeDate" },
          },
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    // Merge aggregations
    const mergedMap = new Map();

    expenseAggregation.forEach((e) => {
      const key = `${e._id.year}-${e._id.month}`;
      mergedMap.set(key, {
        year: e._id.year,
        month: e._id.month,
        totalExpense: e.totalExpense,
        totalIncome: 0,
      });
    });

    incomeAggregation.forEach((i) => {
      const key = `${i._id.year}-${i._id.month}`;
      if (mergedMap.has(key)) {
        mergedMap.get(key).totalIncome = i.totalIncome;
      } else {
        mergedMap.set(key, {
          year: i._id.year,
          month: i._id.month,
          totalExpense: 0,
          totalIncome: i.totalIncome,
        });
      }
    });

    // Sorted array by year/month
    const monthlyData = Array.from(mergedMap.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((item) => ({
        year: item.year,
        month: monthNames[item.month - 1],
        totalExpense: Number(item.totalExpense.toFixed(2)),
        totalIncome: Number(item.totalIncome.toFixed(2)),
      }));

    // Stats calculation
    let totalExpense = 0;
    let totalIncome = 0;
    monthlyData.forEach((item) => {
      totalExpense += item.totalExpense;
      totalIncome += item.totalIncome;
    });

    const monthCount = monthlyData.length || 1;
    const avgExpense = totalExpense / monthCount;
    const avgIncome = totalIncome / monthCount;

    const last = monthlyData[monthlyData.length - 1];
    const prev = monthlyData[monthlyData.length - 2] || {
      totalExpense: 0,
      totalIncome: 0,
    };

    const getTrend = (current, previous) => {
      if (previous === 0) return current === 0 ? "0%" : "↑ 100%";
      const diff = ((current - previous) / previous) * 100;
      const arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "";
      return `${arrow} ${Math.abs(diff).toFixed(2)}%`;
    };

    const getAvgTrend = (current, average) => {
      if (average === 0) return current === 0 ? "0%" : "↑ 100%";
      const diff = ((current - average) / average) * 100;
      const arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "";
      return `${arrow} ${Math.abs(diff).toFixed(2)}%`;
    };

    const stats = {
      currentMonth: `${last.month}-${last.year}`, // Now like "Apr-2025"
      currentExpense: Number(last.totalExpense.toFixed(2)),
      currentIncome: Number(last.totalIncome.toFixed(2)),
      expenseTrend: getTrend(last.totalExpense, prev.totalExpense),
      incomeTrend: getTrend(last.totalIncome, prev.totalIncome),
      averageExpense: Number(avgExpense.toFixed(2)),
      averageIncome: Number(avgIncome.toFixed(2)),
      avgExpenseTrend: getAvgTrend(last.totalExpense, avgExpense),
      avgIncomeTrend: getAvgTrend(last.totalIncome, avgIncome),
    };

    return res.status(200).json({
      monthlyData,
      stats,
    });
  } catch (err) {
    console.error("Error in monthly totals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetTopUser = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "expense"; // 'expense' or 'income'
    const limit = parseInt(req.query.limit) || 5;

    // Step 1: Get total expense per user
    const expenseAgg = await Expense.aggregate([
      {
        $group: {
          _id: "$userId",
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    // Step 2: Get total income per user
    const incomeAgg = await Income.aggregate([
      {
        $group: {
          _id: "$userId",
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    // Step 3: Merge both into a Map by userId
    const userMap = new Map();

    expenseAgg.forEach((e) => {
      userMap.set(e._id.toString(), {
        userId: e._id,
        totalExpense: e.totalExpense,
        totalIncome: 0,
      });
    });

    incomeAgg.forEach((i) => {
      const id = i._id.toString();
      if (userMap.has(id)) {
        userMap.get(id).totalIncome = i.totalIncome;
      } else {
        userMap.set(id, {
          userId: i._id,
          totalExpense: 0,
          totalIncome: i.totalIncome,
        });
      }
    });

    let usersData = Array.from(userMap.values());

    // Step 4: Sort based on query param
    usersData.sort((a, b) =>
      sortBy === "income"
        ? b.totalIncome - a.totalIncome
        : b.totalExpense - a.totalExpense
    );

    // Step 5: Limit results
    usersData = usersData.slice(0, limit);

    // Step 6: Populate user info
    const populatedUsers = await Promise.all(
      usersData.map(async (u) => {
        const user = await User.findById(u.userId).select(
          "firstName lastName email"
        );
        return {
          userId: u.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          totalExpense: Number(u.totalExpense.toFixed(2)),
          totalIncome: Number(u.totalIncome.toFixed(2)),
        };
      })
    );

    res.status(200).json(populatedUsers);
  } catch (err) {
    console.error("Error in GetTopUser:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  UserDetails,
  UpdateUserRole,
  GetAllUserMonthTotalExpenseorIncome,
  GetTopUser,
};
