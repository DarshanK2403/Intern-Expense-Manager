const express = require('express');
const router = express.Router();
const exportController = require('../controllers/ExportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/export/expenses', authMiddleware, exportController.exportExpensePDF);
router.get('/export/incomes', authMiddleware, exportController.exportIncomePDF);
router.post('/export/report', authMiddleware, exportController.exportCustomReportPDF);

module.exports = router;
