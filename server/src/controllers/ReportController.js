const { default: mongoose } = require("mongoose");
const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");
const ReportModel = require("../models/ReportModel");
const CategoryModel = require("../models/Category");
const logActivity = require("../utils/logActivity");
const { format } = require("date-fns");
const Budget = require("../models/BudgetModel");
const Category = require("../models/Category");
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
    const transactionChange = calculateChange(
      expenses.length + incomes.length,
      prevExpenses.length + prevIncomes.length
    );

    const budgetDoc = await Budget.findOne({
      userId,
      year: 2025,
    });

    let startMonth, endMonth;
    if (type !== "year") {
      startMonth = startDate.getUTCMonth();
      endMonth = endDate.getUTCMonth();
    }

    const budgetMap = {};

    for (const cat of budgetDoc?.categories || []) {
      if (!cat || !cat.category || !cat.category._id) continue;

      let total = 0;
      if (type === "year") {
        total = cat.entries.reduce((sum, entry) => sum + entry.amount, 0);
      } else {
        total = cat.entries
          .filter(
            (entry) => entry.month >= startMonth && entry.month <= endMonth
          )
          .reduce((sum, entry) => sum + entry.amount, 0);
      }

      budgetMap[cat.category._id.toString()] = {
        category: cat.category._id,
        budgeted: total,
      };
    }

    const expenseMatch = {
      userId: new mongoose.Types.ObjectId(userId),
      ...(startDate &&
        endDate && {
          expenseDate: { $gte: startDate, $lte: endDate },
        }),
    };

    const expenseData = await Expense.aggregate([
      { $match: expenseMatch },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
          category_name: { $first: "$categoryInfo.category_name" },
        },
      },
    ]);

    const categoryIds = Object.keys(budgetMap);

    const categories = await Category.find({
      _id: { $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).select("category_name");

    const categoryNameMap = {};
    categories.forEach((cat) => {
      categoryNameMap[cat._id.toString()] = cat.category_name;
    });

    const result = [];

    for (const [categoryId, budget] of Object.entries(budgetMap)) {
      const spentEntry = expenseData.find(
        (e) => e._id?.toString() === categoryId
      );

      const spent = spentEntry?.spent || 0;
      const budgeted = budget.budgeted || 0;

      result.push({
        categoryId,
        category_name: categoryNameMap[categoryId] || "Unknown",
        budgeted: budgeted.toFixed(2),
        spent: spent.toFixed(2),
        remaining: (budgeted - spent).toFixed(2),
      });
    }

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
      transaction: formatComparison(transactionChange),
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
      {
        $lookup: {
          from: "categories",
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
          _id: "$categoryInfo.category_name",
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
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $group: {
          _id: "$categoryDetails.category_name",
          value: { $sum: "$amount" },
        },
      },
      {
        $sort: { value: -1 },
      },
    ]);

    const recentIncomes = await Income.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    }).populate("category");

    const recentExpenses = await Expense.find({
      userId,
      expenseDate: { $gte: startDate, $lte: endDate },
    }).populate("category");

    const transaction = [...recentIncomes, ...recentExpenses].sort((a, b) => {
      const aDate = a.expenseDate || a.incomeDate;
      const bDate = b.expenseDate || b.incomeDate;
      return bDate - aDate;
    });

    const categoryTotals = {};
    let highestExpense = null;
    for (const tx of transaction) {
      if (!tx.expenseDate) continue;

      const categoryId = tx.category?._id?.toString();
      if (!categoryId) continue;

      categoryTotals[categoryId] =
        (categoryTotals[categoryId] || 0) + tx.amount;

      if (!highestExpense || tx.amount > highestExpense.amount) {
        highestExpense = tx;
      }
    }

    let highestIncome = null;
    for (const tx of transaction) {
      if (!tx.incomeDate) continue;

      const categoryId = tx.category?._id?.toString();
      if (!categoryId) continue;

      categoryTotals[categoryId] =
        (categoryTotals[categoryId] || 0) + tx.amount;

      if (!highestIncome || tx.amount > highestIncome.amount) {
        highestIncome = tx;
      }
    }

    let topSpendingCategoryId = null;
    let maxSpent = 0;

    for (const [catId, total] of Object.entries(categoryTotals)) {
      if (total > maxSpent) {
        maxSpent = total;
        topSpendingCategoryId = catId;
      }
    }

    let topSpendingCategoryName = "Unknown";

    for (const tx of transaction) {
      const categoryId = tx.category?._id?.toString();
      if (categoryId === topSpendingCategoryId) {
        topSpendingCategoryName = tx.category?.category_name || "Unknown";
        break;
      }
    }

    const targetMonths = [];
    const monthNames = [];
    const tempDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonths = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (tempDate <= endMonths) {
      const monthStr = `${tempDate.getFullYear()}-${String(
        tempDate.getMonth() + 1
      ).padStart(2, "0")}`;
      targetMonths.push(monthStr);

      const monthName = tempDate.toLocaleString("default", { month: "long" });
      monthNames.push(`${monthName} ${tempDate.getFullYear()}`);

      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    const budgetData = {};

    for (let month of targetMonths) {
      const year = parseInt(month.split("-")[0]);
      const monthIndex = parseInt(month.split("-")[1]) - 1;

      const budgetForMonth = await Budget.find({
        userId: new mongoose.Types.ObjectId(req.user.id),
        year,
        "categories.entries.month": monthIndex,
      });

      let totalAmountForMonth = 0;
      if (budgetForMonth.length > 0) {
        budgetForMonth.forEach((budget) => {
          budget.categories.forEach((category) => {
            const entry = category.entries.find(
              (entry) => entry.month === monthIndex
            );
            if (entry) {
              totalAmountForMonth += entry.amount;
            }
          });
        });
      }

      budgetData[month] = totalAmountForMonth;
    }

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
      budgetVsActual: result,
      topSpendingCategory: {
        name: topSpendingCategoryName,
        amount: maxSpent,
      },
      highestExpense: {
        title: highestExpense?.title || "N/A",
        amount: highestExpense?.amount || 0,
        date: highestExpense?.expenseDate || "N/A",
      },
      highestIncome: {
        title: highestIncome?.title || "N/A",
        amount: highestIncome?.amount || 0,
        date: highestIncome?.incomeDate || "N/A",
      },
      budgetData: budgetData,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: error.message });
  }
};

const saveReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = { userId, ...req.body };

    const report = new ReportModel(data);

    // Save the report data to MongoDB
    report.save();

    res.status(201).json({
      message: "Report successfully generated and stored",
      report: report,
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
      `Deleted a report from ${format(
        new Date(report.startDate),
        "dd MMM yyyy"
      )} to ${format(new Date(report.endDate), "dd MMM yyyy")}`
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
