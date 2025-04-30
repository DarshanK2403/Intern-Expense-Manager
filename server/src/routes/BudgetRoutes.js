// routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/BudgetController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

router.get("/budget/:year", budgetController.getBudget);

router.post("/budget/:year", budgetController.createOrUpdateBudget);

router.get("/budget/:year/summary", budgetController.getBudgetSummary);

router.put(
  "/budget/:year/categories/:categoryId/months/:month",
  budgetController.updateBudgetEntry
);

module.exports = router;
