const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController")
const authMiddleware = require("../middleware/authMiddleware");

// Payment Type Route
router.post('/payment-type', authMiddleware, PaymentController.CreatePaymentType)

router.get('/payment-type', authMiddleware, PaymentController.GetPaymentType)

router.delete('/payment-type/:id', authMiddleware, PaymentController.DeletePaymentType)


// Payment Route
router.post('/payment', authMiddleware, PaymentController.CreatePayment);

router.get('/payment', authMiddleware, PaymentController.GetPayment)

router.delete('/payment/:id', authMiddleware, PaymentController.DeletePayment)


module.exports = router