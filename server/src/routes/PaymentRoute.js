const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const protect = require("../middleware/authMiddleware");

router.use(protect);
// Payment Type Route
router.post("/payment-type", PaymentController.CreatePaymentType);

router.get("/payment-type", PaymentController.GetPaymentType);

router.delete("/payment-type/:id", PaymentController.DeletePaymentType);

router.put("/payment-type/:id", PaymentController.UpdatePaymentType);

// Payment Route
router.post("/payment", PaymentController.CreatePayment);

router.get("/payment", PaymentController.GetPayment);

router.delete("/payment/:id", PaymentController.DeletePayment);

module.exports = router;
