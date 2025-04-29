const express = require('express');
const router = express.Router();
const exportController = require('../controllers/ExportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/pdf/expense',authMiddleware, exportController.generateExpensePDF);
router.get('/pdf/income', exportController.generateIncomePDF);
router.get('/pdf/vendor', exportController.generateVendorPDF);
router.get('/pdf/report', exportController.generateReportPDF);

module.exports = router;
