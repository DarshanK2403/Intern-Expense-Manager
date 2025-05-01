const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/IncomeController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

router.post("/add-income", IncomeController.AddIncome);

router.get("/get-income",  IncomeController.getIncomebyUserId);

router.get("/income-details/:id",  IncomeController.getIncomebyId);

router.put("/edit-income/:id", IncomeController.EditIncomebyId);

router.delete("/delete-income",  IncomeController.deleteIncomebyId);

module.exports = router