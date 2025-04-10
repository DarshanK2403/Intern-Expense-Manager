const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/DashboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/recent-transactions",
  authMiddleware,
  DashboardController.recentTransactions
);
router.get("/get-total",authMiddleware, DashboardController.getTotalValues);
router.get("/expensebycategory",authMiddleware, DashboardController.ExpenseByCategory);
router.get("/incomebycategory",authMiddleware, DashboardController.IncomeByCategory);

module.exports = router;
