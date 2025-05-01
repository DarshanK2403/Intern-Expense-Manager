const express = require("express");
const ExpenseController = require("../controllers/ExpenseController");
const Expense = require("../models/ExpenseModel");
const generateFakeExpenses = require("../utils/FakeExpense");
const authMiddleware = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

// POST
router.post("/add-expense", ExpenseController.createExpense);

// GET
router.get("/get-expense", ExpenseController.getExpensebyUserId);
router.get("/expense-details/:id", ExpenseController.getExpenseDetailbyId);

// DELETE
router.delete("/delete-expense", ExpenseController.deleteExpensebyId);

// PUT
router.put("/edit-expense/:id", ExpenseController.UpdateExpensebyId);

module.exports = router;
