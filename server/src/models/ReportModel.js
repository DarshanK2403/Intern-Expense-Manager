const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  totalIncome: { type: Number, required: true },
  totalExpense: { type: Number, required: true },
  balance: { type: Number, required: true },
  savingRate: { type: Number, required: true },
  comparisons: {
    expense: { type: String },
    income: { type: String },
    balance: { type: String },
    savingRate: { type: String },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  prevStartDate: { type: Date, required: true },
  prevEndDate: { type: Date, required: true },
  type: { type: String, required: true },
  formatted: [
    {
      date: { type: String },
      income: { type: Number },
      expense: { type: Number },
    },
  ],
  incomeSources: [
    {
      _id: { type: mongoose.Schema.ObjectId, ref: "IncomeSource" },
      value: { type: Number },
    },
  ],
  expenseByCategory: [
    {
      _id: { type: mongoose.Schema.ObjectId, ref: "Category" },
      value: { type: Number },
    },
  ],
  transaction: [
    {
      _id: { type: mongoose.Schema.ObjectId, ref: "Transaction" },
      title: { type: String },
      description: { type: String },
      amount: { type: Number },
      expenseDate: { type: Date },
      incomeDate: { type: Date },
      category: { type: mongoose.Schema.ObjectId, ref: "Category" },
      paymentThrough: { type: mongoose.Schema.ObjectId, ref: "PaymentMethod" },
      vendor: { type: String },
    },
  ],
},{
  timestamps: true,
});

const ReportModel = mongoose.model("Report", reportSchema);

module.exports = ReportModel;
