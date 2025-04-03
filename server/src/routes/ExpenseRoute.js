const express = require("express");
const ExpenseController = require("../controllers/ExpenseController");

const router = express.Router();

// POST
router.post("/add-expense", ExpenseController.createExpense);

// GET
router.get("/get-expense/:userId", ExpenseController.getExpensebyUserId);
router.get("/expense-details/:id", ExpenseController.getExpenseDetailbyId);

// DELETE
router.delete("/delete-expense/:id", ExpenseController.deleteExpensebyId);

// PUT
router.put("/edit-expense/:id", ExpenseController.UpdateExpensebyId);

module.exports = router;
