const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");
const mongoose = require("mongoose");
const Budget = require("../models/BudgetModel");
const { ObjectId } = require("mongodb");
const Category = require("../models/Category");

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
  const year = new Date().getFullYear();

  try {
    const yearStart = new Date(`${year}-01-01`);
    const yearEnd = new Date(`${year}-12-31`);

    const expenses = await Expense.find({
      userId,
      expenseDate: { $gte: yearStart, $lte: yearEnd },
    });
    const expenseSum = expenses
      .map((data) => Number(data.amount))
      .reduce((total, num) => total + num, 0)
      .toFixed(2);

    const incomes = await Income.find({
      userId,
      incomeDate: { $gte: yearStart, $lte: yearEnd },
    });
    const incomeSum = incomes
      .map((data) => Number(data.amount))
      .reduce((total, num) => total + num, 0)
      .toFixed(2);

    const currentBalance = (incomeSum - expenseSum).toFixed(2);

    const budget = await Budget.findOne({ userId, year });

    let totalBudget = 0;
    let remainingBudget = 0;

    if (budget) {
      totalBudget = budget.categories.reduce((sum, cat) => {
        return sum + cat.entries.reduce((sub, entry) => sub + entry.amount, 0);
      }, 0);
      remainingBudget = totalBudget - parseFloat(expenseSum);
    }

    res.status(200).json({
      totalExpense: expenseSum,
      totalIncome: incomeSum,
      currentBalance,
      remainingBudget: remainingBudget.toFixed(2),
    });
  } catch (error) {
    console.error("Error in getTotalValues:", error);
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
    const otherTotal = categoryExpense
      .slice(9)
      .reduce((sum, item) => sum + item.total, 0);

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

const BudgetDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.params.year);

    if (isNaN(year)) {
      return res.status(400).json({ success: false, message: "Invalid year" });
    }

    // Get user's budget for the year
    const budget = await Budget.findOne({ userId, year });

    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "No budget found" });
    }

    // Fetch categories to help with mapping
    const categories = await Category.find({ userId });

    // Create a mapping from category name to category ID
    const categoryNameToIdMap = categories.reduce((map, category) => {
      map[category.category_name] = category._id.toString();
      return map;
    }, {});

    // Create a reverse mapping from category ID to budget category
    const budgetCategoryMap = budget.categories.reduce((map, cat) => {
      map[categoryNameToIdMap[cat.name]] = cat;
      return map;
    }, {});

    // Get total spent per category from the aggregation
    const totalSpentAggregation = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expenseDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    // Map the aggregation result to an easy-to-use object
    const totalSpentMap = totalSpentAggregation.reduce((map, item) => {
      map[item._id.toString()] = item.totalSpent;
      return map;
    }, {});

    // Create the summary for each category
    const summary = budget.categories.map((cat) => {
      // Calculate the total budget for the category
      const totalBudget = cat.entries.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );

      // Find the corresponding category ID from our mapping
      const categoryId = categoryNameToIdMap[cat.name];

      // Get the total spent for this category using the mapped ID
      const categorySpent = categoryId ? totalSpentMap[categoryId] || 0 : 0;

      return {
        categoryId: cat._id,
        categoryName: cat.name,
        color: cat.color,
        totalBudget,
        totalSpent: categorySpent,
        remaining: totalBudget - categorySpent,
        status:
          categorySpent > totalBudget
            ? "Over Budget"
            : categorySpent > totalBudget * 0.8
            ? "Near Limit"
            : "Safe",
      };
    });

    // Calculate overall totals
    const overallSummary = {
      totalBudget: summary.reduce((sum, cat) => sum + cat.totalBudget, 0),
      totalSpent: summary.reduce((sum, cat) => sum + cat.totalSpent, 0),
    };

    overallSummary.remaining =
      overallSummary.totalBudget - overallSummary.totalSpent;
    overallSummary.status =
      overallSummary.totalSpent > overallSummary.totalBudget
        ? "Over Budget"
        : overallSummary.totalSpent > overallSummary.totalBudget * 0.8
        ? "Near Limit"
        : "Safe";

    res.json({
      success: true,
      data: {
        categories: summary,
        overall: overallSummary,
      },
    });
  } catch (err) {
    console.error("Error fetching budget summary:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  recentTransactions,
  getTotalValues,
  ExpenseByCategory,
  IncomeByCategory,
  BudgetDashboardSummary,
};
