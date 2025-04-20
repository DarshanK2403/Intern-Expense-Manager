const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-report/:type",authMiddleware, ReportController.getReport);

router.post("/save-report",authMiddleware, ReportController.saveReport)

router.get('/saved-report',authMiddleware, ReportController.getSavedReport)

router.get('/report-by-id/:id',authMiddleware, ReportController.getSavedReportById)

router.delete('/delete-report-by-id/:id',authMiddleware, ReportController.deleteReportById)

module.exports = router;
