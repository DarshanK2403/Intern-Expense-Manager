const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    expenseDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
    },
    receipt: {
      type: String,
    },
  },
  {
    timestamps: {
      required: true,
    },
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
