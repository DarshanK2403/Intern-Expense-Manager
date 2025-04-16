const { default: mongoose } = require("mongoose");
const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");

const formatKey = (date, type) =>
  type === "year"
    ? date.toISOString().slice(0, 7)
    : date.toISOString().split("T")[0];

const getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.params;
    const { start, end } = req.body;
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
      prevStartDate = new Date(Date.UTC(today.getFullYear() - offset - 1, 0, 1));
      prevEndDate = new Date(Date.UTC(today.getFullYear() - offset - 1, 11, 31));
    } else if (type === "custom") {
      startDate = new Date(start);
      endDate = new Date(end);
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      // For custom date range, calculate previous period with same duration
      const duration = endDate - startDate;
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
      savingRate: formatComparison(savingRateChange)
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
          incomeDate: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } },
    ]);

    const expenseByCategory = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expenseDate: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } },
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

module.exports = { getReport };