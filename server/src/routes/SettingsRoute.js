const express = require("express");
const router = express.Router();
const SettingController = require('../controllers/SettingController')

router.post('/create-expense-category/:userId', SettingController.CreateExpenseCategory)

router.get('/get-expense-category/:userId', SettingController.GetExpenseCategory);

router.delete('/delete-expense-category/:id', SettingController.DeleteExpenseCategory)

router.post('/create-income-category/:userId', SettingController.CreateIncomeCategory)

router.get('/get-income-category/:userId', SettingController.GetIncomeategory);

router.delete('/delete-income-category/:id', SettingController.DeleteIncomeCategory)

router.post('/create-vendor-category/:userId', SettingController.CreateVendorCategory)

router.get('/get-vendor-category/:userId', SettingController.GetVendorCategory);

router.delete('/delete-vendor-category/:id', SettingController.DeleteVendorCategory)
module.exports = router;