const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/IncomeController");

router.post("/add-income/:userId", IncomeController.AddIncome);

router.get("/get-income/:userId", IncomeController.getIncomebyUserId);
router.get("/get-income-by-id/:id", IncomeController.getIncomebyId);

router.put("/edit-income/:id", IncomeController.EditIncomebyId);

router.delete("/delete-income/:id", IncomeController.deleteIncomebyId);

module.exports = router