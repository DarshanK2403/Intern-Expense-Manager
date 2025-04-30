const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/IncomeController");
const Income = require("../models/IncomeModel");;
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-income",authMiddleware, IncomeController.AddIncome);

router.get("/get-income", authMiddleware, IncomeController.getIncomebyUserId);

router.get("/income-details/:id", authMiddleware, IncomeController.getIncomebyId);

router.put("/edit-income/:id",authMiddleware, IncomeController.EditIncomebyId);

router.delete("/delete-income/:id", authMiddleware, IncomeController.deleteIncomebyId);

module.exports = router