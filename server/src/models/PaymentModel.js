const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: { type: String, required: true, trim: true },
    paymentTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentType",
      default: null,
    },
    detail: {
      type: String,
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, label: 1 }, { unique: true });

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
