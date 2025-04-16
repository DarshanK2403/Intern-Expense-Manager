const express = require("express");
const ExpenseController = require("../controllers/ExpenseController");
const Expense = require("../models/ExpenseModel");
const generateFakeExpenses = require("../utils/FakeTransactionGenerator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/fake-expense", ExpenseController.FakeExpense);

// POST
router.post("/add-expense",authMiddleware, ExpenseController.createExpense);

// GET
router.get("/get-expense", authMiddleware, ExpenseController.getExpensebyUserId);
router.get("/expense-details/:id", ExpenseController.getExpenseDetailbyId);

// DELETE
router.delete("/delete-expense/:id", ExpenseController.deleteExpensebyId);

// PUT
router.put("/edit-expense/:id", ExpenseController.UpdateExpensebyId);

module.exports = router;
