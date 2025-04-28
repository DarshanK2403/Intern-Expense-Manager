const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController/AdminController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/user-details", authMiddleware, AdminController.UserDetails);

router.patch("/users/:id/role", authMiddleware, AdminController.UpdateUserRole);

router.get(
  "/get-total-expense-or-income",
  authMiddleware,
  AdminController.GetAllUserMonthTotalExpenseorIncome
);

router.get("/top-user", authMiddleware, AdminController.GetTopUser);

router.get(
  "/expense-by-category",
  authMiddleware,
  AdminController.ExpenseByCategory
);

module.exports = router;
