const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

router.get("/get-report/:type", ReportController.getReport);

router.post("/save-report", ReportController.saveReport);

router.get("/saved-report", ReportController.getSavedReport);

router.get("/report-by-id/:id", ReportController.getSavedReportById);

router.delete("/delete-report-by-id/:id", ReportController.deleteReportById);

module.exports = router;
