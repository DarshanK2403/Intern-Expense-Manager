const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IncomeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    incomeDate: {
      type: Date,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Category",
    },
    notes: {
      type: String,
      trim: true,
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

const Income = mongoose.model("Income", IncomeSchema);

module.exports = Income;
