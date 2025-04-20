const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");
const mongoose = require("mongoose");

const recentTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const latestExpense = await Expense.find({ userId })
      .sort({
        createdAt: -1,
      })
      .populate("category");

    const latestIncome = await Income.find({ userId })
      .sort({ createdAt: -1 })
      .populate("category");

    // Combine and sort both transactions
    const transactions = [...latestExpense, ...latestIncome].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Return the latest `limit` number of transactions
    const recentTransactions = transactions.slice(0);

    res.status(200).json(recentTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalValues = async (req, res) => {
  const userId = req.user.id;

  try {
    const totalExpense = await Expense.find({ userId });
    const totalExpenseAmount = totalExpense.map((data) => Number(data.amount));
    const expenseSum = totalExpenseAmount
      .reduce((total, num) => total + num, 0)
      .toFixed(2);

    const totalIncome = await Income.find({ userId });
    const totalIncomeAmount = totalIncome.map((data) => Number(data.amount));
    const incomeSum = totalIncomeAmount
      .reduce((total, num) => total + num, 0)
      .toFixed(2);

    const currentBalance = (incomeSum - expenseSum).toFixed(2);

    res.status(200).json({
      totalExpense: expenseSum,
      totalIncome: incomeSum,
      currentBalance: currentBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ExpenseByCategory = async (req, res) => {
  const userId = req.user.id;
  try {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const categoryExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$category", // This is still ObjectId for now
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories", // name of the collection in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          category_id: "$_id",
          category_name: "$categoryInfo.category_name", // adjust field name if needed
          total: 1,
        },
      },
      { $sort: { total: -1 } }, // Sort by total, descending
    ]);

    // Split into top 9 and "Other"
    const top9 = categoryExpense.slice(0, 9);
    const otherTotal = categoryExpense.slice(9).reduce((sum, item) => sum + item.total, 0);

    if (otherTotal > 0) {
      top9.push({
        category_name: "Other",
        total: otherTotal,
      });
    }

    res.status(200).json(top9); // Return the top 9 categories with "Other" as necessary
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const IncomeByCategory = async (req, res) => {
  const userId = req.user.id;
  try {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const categoryIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$category", // Group by category ObjectId
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories", // Must match your MongoDB collection name exactly
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          category_id: "$_id",
          category_name: "$categoryInfo.category_name", // Adjust if your field is `name` instead
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(categoryIncome);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

module.exports = {
  recentTransactions,
  getTotalValues,
  ExpenseByCategory,
  IncomeByCategory,
};
