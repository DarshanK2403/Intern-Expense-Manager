const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-report/:type",authMiddleware, ReportController.getReport);

module.exports = router;
