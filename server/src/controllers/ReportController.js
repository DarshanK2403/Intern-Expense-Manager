const { default: mongoose } = require("mongoose");
const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");
const ReportModel = require("../models/ReportModel");
const CategoryModel = require("../models/Category");
const logActivity = require("../utils/logActivity");
const { format } = require("date-fns");

const formatKey = (date, type) =>
  type === "year"
    ? date.toISOString().slice(0, 7)
    : date.toISOString().split("T")[0];

const getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.params;
    const { start, end } = req.query;
    const offset = parseInt(req.query.offset) || 0;
    const today = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    if (type === "week") {
      startDate = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate.setDate(today.getDate() - daysToMonday - offset * 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      // Previous week
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
      prevEndDate = new Date(prevStartDate);
      prevEndDate.setDate(prevStartDate.getDate() + 6);
    } else if (type === "month") {
      startDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth() - offset, 1)
      );
      endDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth() - offset + 1, 0)
      );

      // Previous month
      prevStartDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth() - offset - 1, 1)
      );
      prevEndDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth() - offset, 0)
      );
    } else if (type === "year") {
      startDate = new Date(Date.UTC(today.getFullYear() - offset, 0, 1));
      endDate = new Date(Date.UTC(today.getFullYear() - offset, 11, 31));

      // Previous year
      prevStartDate = new Date(
        Date.UTC(today.getFullYear() - offset - 1, 0, 1)
      );
      prevEndDate = new Date(
        Date.UTC(today.getFullYear() - offset - 1, 11, 31)
      );
    } else if (type === "custom") {
      // Check if start and end dates are provided
      if (!start || !end) {
        return res.status(400).json({
          message: "Start and end dates are required for custom reports",
        });
      }

      startDate = new Date(start);
      endDate = new Date(end);

      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      // Make sure end date is not before start date
      if (endDate < startDate) {
        return res
          .status(400)
          .json({ message: "End date cannot be before start date" });
      }

      // For custom date range, calculate previous period with same duration
      const duration = endDate.getTime() - startDate.getTime();
      prevEndDate = new Date(startDate);
      prevEndDate.setDate(prevEndDate.getDate() - 1);
      prevStartDate = new Date(prevEndDate);
      prevStartDate.setTime(prevStartDate.getTime() - duration);
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }

    // Current period data
    const expenses = await Expense.find({
      userId,
      expenseDate: { $gte: startDate, $lte: endDate },
    });

    const incomes = await Income.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    });

    const totalExpense = expenses
      .reduce((sum, e) => sum + e.amount, 0)
      .toFixed(2);
    const totalIncome = incomes
      .reduce((sum, i) => sum + i.amount, 0)
      .toFixed(2);
    const balance = (totalIncome - totalExpense).toFixed(2);
    const savingRate =
      totalIncome > 0 ? Number(((balance / totalIncome) * 100).toFixed(2)) : 0;

    // Previous period data
    const prevExpenses = await Expense.find({
      userId,
      expenseDate: { $gte: prevStartDate, $lte: prevEndDate },
    });

    const prevIncomes = await Income.find({
      userId,
      incomeDate: { $gte: prevStartDate, $lte: prevEndDate },
    });

    const prevTotalExpense = prevExpenses
      .reduce((sum, e) => sum + e.amount, 0)
      .toFixed(2);
    const prevTotalIncome = prevIncomes
      .reduce((sum, i) => sum + i.amount, 0)
      .toFixed(2);
    const prevBalance = (prevTotalIncome - prevTotalExpense).toFixed(2);
    const prevSavingRate =
      prevTotalIncome > 0
        ? Number(((prevBalance / prevTotalIncome) * 100).toFixed(2))
        : 0;

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous == 0) return current > 0 ? "0" : "0.00";
      const change = ((current - previous) / Math.abs(previous)) * 100;
      return change.toFixed(2);
    };

    const expenseChange = calculateChange(totalExpense, prevTotalExpense);
    const incomeChange = calculateChange(totalIncome, prevTotalIncome);
    const balanceChange = calculateChange(balance, prevBalance);
    const savingRateChange = calculateChange(savingRate, prevSavingRate);

    // Format comparison strings
    const formatComparison = (change) => {
      if (change === "0") return `+0% vs previous ${type}`;
      const prefix = parseFloat(change) >= 0 ? "+" : "";
      return `${prefix}${change}% vs last ${type}`;
    };

    const comparisons = {
      expense: formatComparison(expenseChange),
      income: formatComparison(incomeChange),
      balance: formatComparison(balanceChange),
      savingRate: formatComparison(savingRateChange),
    };

    const groupedData = {};

    for (const expense of expenses) {
      const key = formatKey(expense.expenseDate, type);
      groupedData[key] = groupedData[key] || { income: 0, expense: 0 };
      groupedData[key].expense += expense.amount;
    }

    for (const income of incomes) {
      const key = formatKey(income.incomeDate, type);
      groupedData[key] = groupedData[key] || { income: 0, expense: 0 };
      groupedData[key].income += income.amount;
    }

    const formattedData = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const key = formatKey(currentDate, type);
      let dateLabel;

      if (type === "week") {
        dateLabel = currentDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
      } else if (type === "month") {
        dateLabel = currentDate.getDate();
      } else if (type === "year") {
        dateLabel = currentDate.toLocaleDateString("en-US", { month: "short" });
      } else if (type === "custom") {
        // For custom type, use ISO date format
        dateLabel = currentDate.toISOString().split("T")[0];
      }

      formattedData.push({
        [type === "week" ? "day" : type === "year" ? "month" : "date"]:
          dateLabel,
        income: groupedData[key]?.income.toFixed(2) || 0,
        expense: groupedData[key]?.expense.toFixed(2) || 0,
      });

      type === "year"
        ? currentDate.setMonth(currentDate.getMonth() + 1)
        : currentDate.setDate(currentDate.getDate() + 1);
    }

    const incomeSources = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          incomeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      // Join with CategoryModel
      {
        $lookup: {
          from: "categories", // make sure this matches your actual MongoDB collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$categoryInfo.category_name", // Group by category name
          value: { $sum: "$amount" },
        },
      },
      {
        $sort: { value: -1 },
      },
    ]);

    const expenseByCategory = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expenseDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "categories", // Name of the collection where the categories are stored
          localField: "category", // Field in the Expense collection
          foreignField: "_id", // Field in the Category collection
          as: "categoryDetails", // Alias for the joined data
        },
      },
      {
        $unwind: "$categoryDetails", // Unwind the array that comes from the lookup
      },
      {
        $group: {
          _id: "$categoryDetails.category_name", // Group by the category_name field
          value: { $sum: "$amount" }, // Sum the amount for each category
        },
      },
      {
        $sort: { value: -1 }, // Sort by value in descending order
      },
    ]);

    const recentIncomes = await Income.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    }).limit(5);

    const recentExpenses = await Expense.find({
      userId,
      expenseDate: { $gte: startDate, $lte: endDate },
    }).limit(5);

    const transaction = [...recentIncomes, ...recentExpenses].sort((a, b) => {
      const aDate = a.expenseDate || a.incomeDate;
      const bDate = b.expenseDate || b.incomeDate;
      return bDate - aDate;
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      savingRate,
      comparisons,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      prevStartDate: prevStartDate.toISOString().split("T")[0],
      prevEndDate: prevEndDate.toISOString().split("T")[0],
      type,
      offset,
      formatted: formattedData,
      incomeSources,
      expenseByCategory,
      transaction,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const saveReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      totalIncome,
      totalExpense,
      balance,
      savingRate,
      comparisons,
      startDate,
      endDate,
      prevStartDate,
      prevEndDate,
      type,
      offset,
      formatted,
      incomeSources,
      expenseByCategory,
      transaction,
    } = req.body;

    // 🔁 Convert category names to ObjectIds
    const updatedExpenseByCategory = await Promise.all(
      expenseByCategory.map(async (item) => {
        const category = await CategoryModel.findOne({ name: item._id });
        return {
          _id: category ? category._id : null,
          totalAmount: item.totalAmount,
          count: item.count,
        };
      })
    );

    const filteredExpenseByCategory = updatedExpenseByCategory.filter(
      (item) => item._id
    );

    // 🔁 Convert income source names to ObjectIds
    const updatedIncomeSources = await Promise.all(
      incomeSources.map(async (item) => {
        const source = await Income.findOne({ name: item._id });
        return {
          _id: source ? source._id : null,
          value: item.value,
        };
      })
    );

    const filteredIncomeSources = updatedIncomeSources.filter(
      (item) => item._id
    );

    const newReport = new ReportModel({
      userId,
      totalIncome,
      totalExpense,
      balance,
      savingRate,
      comparisons,
      startDate,
      endDate,
      prevStartDate,
      prevEndDate,
      type,
      offset,
      formatted,
      incomeSources: filteredIncomeSources, // ✅ Fixed
      expenseByCategory: filteredExpenseByCategory,
      transaction,
    });

    const savedReport = await newReport.save();
    await logActivity(
      userId,
      "GENERATE_REPORT",
      `Generated a report from ${format(new Date(startDate), "dd MMM yyyy")} to ${format(new Date(endDate), "dd MMM yyyy")}`
    );
  
    res.status(201).json({
      message: "Report successfully generated and stored",
      report: savedReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating and storing the report",
      error: error.message,
    });
  }
};

const getSavedReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const report = await ReportModel.find({ userId });

    // Check if the report exists
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Return the report data
    return res.status(200).json(report);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSavedReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    // console.log(id);

    const report = await ReportModel.findById(id);

    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found or unauthorized" });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteReportById = async (req, res) => {
  try {
    const userId = req.user.id;
    const reportId = req.params.id;

    const report = await ReportModel.findOneAndDelete({
      _id: reportId,
      userId,
    });

    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found or unauthorized" });
    }

    // ✅ Log Activity after successful delete
    await logActivity(
      userId,
      "DELETE_REPORT",
      `Deleted a report from ${format(new Date(report.startDate), "dd MMM yyyy")} to ${format(new Date(report.endDate), "dd MMM yyyy")}`
    );

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getReport,
  saveReport,
  getSavedReport,
  getSavedReportById,
  deleteReportById,
};
