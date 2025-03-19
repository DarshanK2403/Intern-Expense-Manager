const express = require("express");
const ExpenseController = require("../controllers/ExpenseController");

const router = express.Router();

// Route for creating an expense (with file upload)
router.post("/add-expense", ExpenseController.createExpense);
router.get("/get-expense/:userId", ExpenseController.getExpensebyUserId);
router.get("/get-latest-expense/:userId", ExpenseController.getLatestExpense);
router.get("/expense-details/:id", ExpenseController.getExpenseDetailbyId);
router.delete("/delete-expense/:id", ExpenseController.deleteExpensebyId);

module.exports = router;
