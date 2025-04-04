const User = require("../../models/UserModel");
const Expense = require("../../models/ExpenseModel");
const Income = require("../../models/IncomeModel");

const UserDetails = async (req, res) => {
  try {
    const TotalUser = await User.find().populate("role");
    const usersWithExpenseCount = await Promise.all(
      TotalUser.map(async (user) => {
        const expenseCount = await Expense.countDocuments({
          userId: user._id,
        });
        const incomeCount = await Income.countDocuments({
          userId: user._id,
        })
        return { ...user.toObject(), totalExpenses: expenseCount, totalIncome: incomeCount};
      })
    );

    if (TotalUser.length > 0) {
      res.status(200).json(usersWithExpenseCount);
    } else {
      res.status(200).json("Not Have any User Details");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  UserDetails,
};
