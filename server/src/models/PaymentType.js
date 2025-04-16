// models/PaymentType.js
const mongoose = require("mongoose");

const PaymentTypeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

PaymentTypeSchema.index({ userId: 1, name: 1 }, { unique: true });

const PaymentType = mongoose.model("PaymentType", PaymentTypeSchema);

module.exports = PaymentType;
