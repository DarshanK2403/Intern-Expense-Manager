const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");

const recentTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const latestExpense = await Expense.find({ userId }).sort({
      createdAt: -1,
    });

    const latestIncome = await Income.find({ userId }).sort({ createdAt: -1 });

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

const mongoose = require("mongoose");

const ExpenseByCategory = async (req, res) => {
  const userId = req.user.id;
  try {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;
    const categoryExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(categoryExpense);
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

    const categoryExpense = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(categoryExpense);
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
