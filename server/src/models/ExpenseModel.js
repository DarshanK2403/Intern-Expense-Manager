const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
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
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Category",
    },
    paymentThrough: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment"
    },
    vendor: {
      type: String,
    },
    receipt: {
      cloudinaryUrl: { type: String },
      originalName: { type: String },
      uniqueName: { type: String },
      fileType: { type: String },
    },
  },
  {
    timestamps: {
      required: true,
    },
  }
);

ExpenseSchema.index(
  { userId: 1, title: 1, amount: 1, expenseDate: 1 },
  { unique: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
