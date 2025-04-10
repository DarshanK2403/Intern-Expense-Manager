const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/IncomeController");
const generateFakeIncomes = require("../utils/GenerateFakeIncomes");
const Income = require("../models/IncomeModel");;

router.post("/fake-income", async (req, res) => {
    try {
      const { userId, count = 20, month, year } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
  
      const fakeIncomes = generateFakeIncomes(userId, count, { month, year });
  
      await Income.insertMany(fakeIncomes);
  
      res.status(201).json({
        message: `${count} fake incomes generated successfully`,
        data: fakeIncomes,
      });
    } catch (err) {
      console.error("Error generating incomes:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.post("/add-income/:userId", IncomeController.AddIncome);

router.get("/get-income/:userId", IncomeController.getIncomebyUserId);
router.get("/get-income-by-id/:id", IncomeController.getIncomebyId);

router.put("/edit-income/:id", IncomeController.EditIncomebyId);

router.delete("/delete-income/:id", IncomeController.deleteIncomebyId);

module.exports = router