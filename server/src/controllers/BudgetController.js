const Budget = require("../models/BudgetModel");
const mongoose = require("mongoose");
const Category = require('../models/Category');

const getBudget = async (req, res) => {
  try {
    const { year } = req.params;
    const userId = req.user.id;

    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid year format",
      });
    }

    // Find and populate the category details
    let budget = await Budget.findOne({ userId, year: yearInt }).populate(
      "categories.category"
    );

    // If no budget, create a blank one
    if (!budget) {
      budget = new Budget({
        userId,
        year: yearInt,
        categories: [],
      });
      await budget.save();
    }

    return res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createOrUpdateBudget = async (req, res) => {
  try {
    const { year } = req.params;
    const { categories } = req.body;
    const userId = req.user.id;

    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid year format",
      });
    }

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Categories must be an array",
      });
    }

    for (const cat of categories) {
      if (!mongoose.Types.ObjectId.isValid(cat.category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ObjectId",
        });
      }

      const categoryExists = await Category.exists({
        _id: cat.category,
        userId,
      });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: `Category with id ${cat.category} not found for user`,
        });
      }

      if (!Array.isArray(cat.entries)) {
        return res.status(400).json({
          success: false,
          message: "Each category must have an entries array",
        });
      }

      for (const entry of cat.entries) {
        if (
          typeof entry.month !== "number" ||
          entry.month < 0 ||
          entry.month > 11 ||
          typeof entry.amount !== "number" ||
          entry.amount < 0
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid entry format in category",
          });
        }
      }
    }

    let budget = await Budget.findOne({ userId, year: yearInt });

    if (budget) {
      budget.categories = categories;
    } else {
      budget = new Budget({
        userId,
        year: yearInt,
        categories,
      });
    }

    await budget.save();

    const populatedBudget = await budget.populate("categories.category");

    return res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      data: populatedBudget,
    });
  } catch (error) {
    console.error("Error saving budget:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateBudgetEntry = async (req, res) => {
  try {
    const { year, categoryId, month } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    // Parse parameters
    const yearInt = parseInt(year);
    const monthInt = parseInt(month);
    const amountFloat = parseFloat(amount);

    // Validate parameters
    if (isNaN(yearInt) || isNaN(monthInt) || isNaN(amountFloat)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters",
      });
    }

    if (monthInt < 0 || monthInt > 11) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 0 and 11",
      });
    }

    if (amountFloat < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    // Find the budget
    const budget = await Budget.findOne({ userId, year: yearInt });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Find the category
    const category = budget.categories.id(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Find the entry for the specified month
    let entry = category.entries.find((entry) => entry.month === monthInt);

    if (entry) {
      // Update existing entry
      entry.amount = amountFloat;
    } else {
      // Add new entry if it doesn't exist
      category.entries.push({
        month: monthInt,
        amount: amountFloat,
      });
    }

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget entry updated successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Error updating budget entry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getBudgetSummary = async (req, res) => {
  try {
    const { year } = req.params;
    const userId = req.user.id;

    // Parse year to integer
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid year format",
      });
    }

    // Find the budget
    const budget = await Budget.findOne({ userId, year: yearInt });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Calculate monthly totals
    const monthlyTotals = [];
    for (let month = 0; month < 12; month++) {
      monthlyTotals.push(budget.getMonthlyTotal(month));
    }

    // Calculate category totals
    const categoryTotals = budget.categories.map((category) => ({
      id: category._id,
      name: category.name,
      color: category.color,
      total: budget.getCategoryTotal(category._id),
    }));

    // Calculate grand total
    const grandTotal = budget.totalAmount;

    return res.status(200).json({
      success: true,
      data: {
        year: yearInt,
        monthlyTotals,
        categoryTotals,
        grandTotal,
      },
    });
  } catch (error) {
    console.error("Error getting budget summary:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getBudget,
  createOrUpdateBudget,
  updateBudgetEntry,
  getBudgetSummary,
};
