const Category = require("../models/Category"); // adjust path as needed
const generateFakeData = require("../utils/FakeExpense"); // adjust path
const Expense = require("../models/ExpenseModel");
const PaymentMethod = require("../models/PaymentModel"); // adjust path as needed
const Income = require("../models/IncomeModel"); // adjust path as needed

const FakeExpenseAndIncome = async (req, res) => {
  try {
    const { userId, count = 20, month, year } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const paymentMethods = await PaymentMethod.find({ userId });
    if (!paymentMethods.length) {
      return res.status(400).json({ error: "No payment methods found" });
    }

    const expenseCategories = await Category.find({
      userId,
      category_type: "expense",
    });
    if (!expenseCategories.length) {
      return res.status(400).json({ error: "No expense categories found" });
    }

    const incomeCategories = await Category.find({
      userId,
      category_type: "income",
    });
    if (!incomeCategories.length) {
      return res.status(400).json({ error: "No income categories found" });
    }

    const fakeData = generateFakeData(
      userId,
      expenseCategories,
      incomeCategories,
      paymentMethods,
      count,
      { month, year }
    );

    const fakeExpenses = fakeData.filter(item => item.expenseDate);
    const fakeIncome = fakeData.filter(item => item.incomeDate);

    await Expense.insertMany(fakeExpenses);

    await Income.insertMany(fakeIncome);

    return res.status(201).json({
      message: `${fakeExpenses.length} fake expenses and ${fakeIncome.length} fake incomes created successfully`,
      data: {
        expenses: fakeExpenses,
        income: fakeIncome,
      },
    });
  } catch (err) {
    console.error("Error generating fake expenses and income:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  FakeExpenseAndIncome,
};
