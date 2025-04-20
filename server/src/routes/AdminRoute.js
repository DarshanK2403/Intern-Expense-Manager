const express = require("express");
const router = express.Router();
const AdminController = require('../controllers/AdminController/AdminController')
const authMiddleware = require("../middleware/authMiddleware");

router.get('/user-details', AdminController.UserDetails)

router.patch('/users/:id/role', authMiddleware, AdminController.UpdateUserRole);

router.get('/get-total-expense-or-income', AdminController.GetAllUserMonthTotalExpenseorIncome);

router.get('/top-user', AdminController.GetTopUser)

module.exports = router