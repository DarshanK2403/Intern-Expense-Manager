// models/Report.js

const mongoose = require("mongoose");

const ComparisonSchema = new mongoose.Schema(
  {
    expense: String,
    income: String,
    balance: String,
    savingRate: String,
    transaction: String,
  },
  { _id: false }
);

const FormattedDataSchema = new mongoose.Schema(
  {
    date: String,
    income: String,
    expense: String,
  },
  { _id: false }
);

const IncomeSourceSchema = new mongoose.Schema(
  {
    _id: String, // Category name
    value: Number,
  },
  { _id: false }
);

const ExpenseByCategorySchema = new mongoose.Schema(
  {
    _id: String, // Category name
    value: Number,
  },
  { _id: false }
);

const budgetVsActualSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  category_name: String,
  budgeted: String,
  spent: String,
  remaining: String,
});

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, default: "custom" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    prevStartDate: Date,
    prevEndDate: Date,
    offset: { type: Number, default: 0 },
    budgetVsActual: [budgetVsActualSchema],
    totalIncome: String,
    totalExpense: String,
    balance: String,
    savingRate: Number,
    topSpendingCategory: {
      name: String,
      amount: Number,
    },
    highestExpense: {
      title: String,
      amount: Number,
      date: Date,
    },
    highestIncome: {
      title: String,
      amount: Number,
      date: Date,
    },
    comparisons: ComparisonSchema,
    formatted: [FormattedDataSchema],
    incomeSources: [IncomeSourceSchema],
    expenseByCategory: [ExpenseByCategorySchema],

    transaction: [{ type: mongoose.Schema.Types.Mixed }], // Save as-is or normalize if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
