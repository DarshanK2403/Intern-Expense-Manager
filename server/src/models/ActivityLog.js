// models/ActivityLog.js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  actionType: {
    type: String,
    enum: [
      // Expense Activities
      "CREATE_EXPENSE",
      "UPDATE_EXPENSE",
      "DELETE_EXPENSE",

      // Income Activities
      "CREATE_INCOME",
      "UPDATE_INCOME",
      "DELETE_INCOME",

      // Vendor Activities
      "CREATE_VENDOR",
      "UPDATE_VENDOR",
      "DELETE_VENDOR",

      // Report Activities
      "GENERATE_REPORT",
      "DELETE_REPORT",

      // Profile Activities
      "UPDATE_PROFILE",

      // Category
      "CREATE_CATEGORY",
      "UPDATE_CATEGORY",
      "DELETE_CATEGORY",

      // Payment
      "CREATE_PAYMENT",
      "CREATE_PAYMENT_TYPE",
      "UPDATE_PAYMENT",
      "UPDATE_PAYMENT_TYPE",
      "DELETE_PAYMENT",
      "DELETE_PAYMENT_TYPE",
    ],

    required: true,
  },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
