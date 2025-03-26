const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/DashboardController");

router.get("/recent-transactions/:userId", DashboardController.recentTransactions);
router.get("/get-total/:userId", DashboardController.getTotalValues);
router.get("/expensebycategory/:userId", DashboardController.ExpenseByCategory);

module.exports = router;