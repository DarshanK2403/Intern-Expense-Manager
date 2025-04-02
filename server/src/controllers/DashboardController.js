const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");

const recentTransactions = async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const latestExpense = await Expense.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    const latestIncome = await Income.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Combine transactions
    const transactions = [...latestExpense, ...latestIncome];

    // Correct Sorting
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get the latest 5 transactions
    const recentTransactions = transactions.slice(0, limit);

    res.status(200).json(recentTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalValues = async (req, res) => {
  const { userId } = req.params;
  try {
    const totalExpense = await Expense.find({ userId });
    const totalExpenseAmount = totalExpense.map((data) => data.amount);
    const ExpenseSum = totalExpenseAmount.reduce(
      (total, num) => total + num,
      0
    );

    const totalIncome = await Income.find({ userId });
    const toalIncomeAmount = totalIncome.map((data) => data.amount);
    const IncomeSum = toalIncomeAmount.reduce((total, num)=> total + num, 0)

    const currentBalance = IncomeSum - ExpenseSum
    res.status(200).json({totalExpense: ExpenseSum, totalIncome: IncomeSum, currentBalance: currentBalance});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require("mongoose");

const ExpenseByCategory = async (req, res) => {
    try {
        const userId = req.params.userId; // Extract userId from params
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

        const categoryExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },  // Filter by userId
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            {$sort: {total: -1}}
        ]);

        res.status(200).json(categoryExpense);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
};

const IncomeByCategory = async (req, res) => {
  try {
      const userId = req.params.userId; // Extract userId from params
      const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

      const categoryExpense = await Income.aggregate([
          { $match: { userId: userObjectId } },  // Filter by userId
          { $group: { _id: "$category", total: { $sum: "$amount" } } },
          {$sort: {total: -1}}
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
