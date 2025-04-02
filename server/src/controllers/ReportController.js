const { default: mongoose } = require("mongoose");
const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");

const getReport = async (req, res) => {
  try {
    const { type, userId } = req.params;
    const { start, end } = req.body;
    const offset = parseInt(req.query.offset) || 0;

    const today = new Date();
    let startDate, endDate;

    if (type === "weekly") {
      startDate = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate.setDate(today.getDate() - daysToMonday - offset * 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (type === "monthly") {
      startDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth() - offset, 1)
      );
      endDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth() - offset + 1, 0)
      );
    } else if (type === "yearly") {
      startDate = new Date(Date.UTC(today.getFullYear() - offset, 0, 1));
      endDate = new Date(Date.UTC(today.getFullYear() - offset, 11, 31));
    } else if (type === "custom") {
      startDate = new Date(start);
      endDate = new Date(end);
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }

    const expenses = await Expense.find({
      userId,
      expenseDate: { $gte: startDate, $lte: endDate },
    });
    const incomes = await Income.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const balance = totalIncome - totalExpense;

    const savingRate = ((totalIncome - totalExpense) / totalIncome) * 100;

    const groupedData = {};

    for (const expense of expenses) {
      const key =
        type === "yearly"
          ? expense.expenseDate.toISOString().slice(0, 7)
          : expense.expenseDate.toISOString().split("T")[0];
      groupedData[key] = groupedData[key] || { income: 0, expense: 0 };
      groupedData[key].expense += expense.amount;
    }

    for (const income of incomes) {
      const key =
        type === "yearly"
          ? income.incomeDate.toISOString().slice(0, 7)
          : income.incomeDate.toISOString().split("T")[0];
      groupedData[key] = groupedData[key] || { income: 0, expense: 0 };
      groupedData[key].income += income.amount;
    }

    let formattedData = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const key =
        type === "yearly"
          ? currentDate.toISOString().slice(0, 7)
          : currentDate.toISOString().split("T")[0];

      let dateLabel;

      if (type === "weekly") {
        // For weekly, get the day name
        const dayName = currentDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        dateLabel = dayName;
      } else if (type === "monthly") {
        // For monthly, get the numerical date
        dateLabel = currentDate.getDate();
      } else if (type === "yearly") {
        // For yearly, get the full month name
        const monthName = currentDate.toLocaleDateString("en-US", {
          month: "short",
        });
        dateLabel = monthName;
      }

      formattedData.push({
        [type === "weekly" ? "day" : type === "yearly" ? "month" : "date"]:
          dateLabel,
        income: groupedData[key]?.income || 0,
        expense: groupedData[key]?.expense || 0,
      });

      // Increment the date based on the report type
      if (type === "yearly") {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
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

    const transaction = [...recentIncomes, ...recentExpenses].sort(
      (a, b) => b.expenseDate - a.incomeDate
    );

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      savingRate: savingRate.toFixed(2),
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      type,
      offset,
      [type === "weekly" ? "weekly" : type === "yearly" ? "yearly" : "monthly"]:
        formattedData,
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
