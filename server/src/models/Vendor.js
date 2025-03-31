const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true, unique: true, },
    email: { type: String },
    phone: { type: Number, trim: true },
    category: { type: String },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
