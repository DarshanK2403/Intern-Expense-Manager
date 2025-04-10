const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["week", "month", "year", "custom"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  offset: {
    type: Number,
    default: 0,
  },
  totalIncome: {
    type: Number,
    required: true,
  },
  totalExpense: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  savingRate: {
    type: Number,
    required: true,
  },
  formatted: [
    {
      day: String,
      date: String,
      month: String,
      income: Number,
      expense: Number,
    },  
  ],
  incomeSources: [
    {
      _id: String,
      value: Number,
    },
  ],
  expenseByCategory: [
    {
      _id: String,
      value: Number,
    },
  ],
  transaction: [
    {
      title: String,
      amount: Number,
      category: String,
      incomeDate: Date,
      expenseDate: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
