const express = require('express');
const router = express.Router();
const exportController = require('../controllers/ExportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/pdf/expense', exportController.generateExpensePDF);
router.get('/pdf/income', exportController.generateIncomePDF);
router.get('/pdf/vendor', exportController.generateVendorPDF);
router.get('/pdf/report', exportController.generateReportPDF);

module.exports = router;


module.exports = router;
