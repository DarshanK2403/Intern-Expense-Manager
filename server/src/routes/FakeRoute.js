const express = require("express");
const router = express.Router();
const FakeController = require("../controllers/Faker");

router.post("/fake-data", FakeController.FakeExpenseAndIncome);

module.exports = router;
