const PaymentType = require("../models/PaymentType");
const PaymentMethod = require("../models/PaymentModel");

// Default payment types (user-specific)
const defaultPaymentTypes = [
  "Cash",
  "Bank Transfer",
  "Debit/Credit Card",
  "UPI",
  "Digital Wallet",
  "Cheque",
  "Other",
];

// Default payment methods (with type labels to link later)
const defaultPaymentMethods = [
  { label: "Cash", typeName: "Cash" },
  { label: "Credit Card", typeName: "Debit/Credit Card" },
  { label: "Debit Card", typeName: "Debit/Credit Card" },
  { label: "Cheque", typeName: "Cheque" },
];

const createDefaultPaymentsForUser = async (userId) => {
  try {
    const typeMap = {};

    // Create Payment Types
    for (const name of defaultPaymentTypes) {
      const existing = await PaymentType.findOne({ userId, name });
      if (!existing) {
        const newType = await PaymentType.create({ userId, name });
        typeMap[name] = newType._id;
      } else {
        typeMap[name] = existing._id;
      }
    }

    // Create Payment Methods
    for (const method of defaultPaymentMethods) {
      const exists = await PaymentMethod.findOne({
        userId,
        label: method.label,
      });

      if (!exists) {
        await PaymentMethod.create({
          userId,
          label: method.label,
          paymentTypeId: typeMap[method.typeName],
          detail: "",
        });
      }
    }

    console.log(
      `✅ Default payment types and methods created for user: ${userId}`
    );
  } catch (err) {
    console.error("❌ Error in paymentUtil:", err);
  }
};

module.exports = { createDefaultPaymentsForUser };
