const express = require("express");
const ExpenseController = require("../controllers/ExpenseController");
const Expense = require("../models/ExpenseModel");
const generateFakeExpenses = require("../utils/FakeTransactionGenerator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-fake", async (req, res) => {
    try {
        const { userId, count = 20, month, year } = req.body;
    
        if (!userId) {
          return res.status(400).json({ error: "userId is required" });
        }
    
        const fakeIncomes = generateFakeExpenses(userId, count, { month, year });
    
        await Expense.insertMany(fakeIncomes);
    
        res.status(201).json({
          message: `${count} fake Expense generated successfully`,
          data: fakeIncomes,
        });
      } catch (err) {
        console.error("Error generating incomes:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
});
// POST
router.post("/add-expense", ExpenseController.createExpense);

// GET
router.get("/get-expense", authMiddleware, ExpenseController.getExpensebyUserId);
router.get("/expense-details/:id", ExpenseController.getExpenseDetailbyId);

// DELETE
router.delete("/delete-expense/:id", ExpenseController.deleteExpensebyId);

// PUT
router.put("/edit-expense/:id", ExpenseController.UpdateExpensebyId);

module.exports = router;
