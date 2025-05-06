const PaymentModel = require("../models/PaymentModel");
const PaymentType = require("../models/PaymentType");

// Payment Type
const CreatePaymentType = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // assuming you're using authMiddleware to attach user to req

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: "Payment type name is required." });
    }

    const newType = await PaymentType.create({
      userId,
      name: name.trim(),
    });

    return res.status(201).json({
      message: "Payment type created successfully.",
      data: newType,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Payment type already exists." });
    }

    console.error("CreatePaymentType Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetPaymentType = async (req, res) => {
  try {
    const userId = req.user.id;

    const types = await PaymentType.find({ userId }).sort({ name: 1 });

    return res.status(200).json({
      message: "Payment types fetched successfully.",
      data: types,
    });
  } catch (err) {
    console.error("GetPaymentType Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeletePaymentType = async (req, res) => {
  try {
    const userId = req.user.id;
    const typeId = req.params.id;

    // Check if this payment type is used by any payment label
    const used = await PaymentModel.findOne({ userId, paymentTypeId: typeId });

    if (used) {
      return res.status(400).json({
        message: "Cannot delete: this payment type is used in payment labels.",
      });
    }

    const deleted = await PaymentType.findOneAndDelete({ _id: typeId, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Payment type not found." });
    }

    return res.status(200).json({
      message: "Payment type deleted successfully.",
      data: deleted,
    });
  } catch (err) {
    console.error("DeletePaymentType Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdatePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: "Payment type name is required." });
    }

    const existingType = await PaymentType.findOne({
      _id: id,
      userId,
    });

    if (!existingType) {
      return res.status(404).json({ message: "Payment type not found." });
    }

    // Check for duplicate name for the same user
    const duplicate = await PaymentType.findOne({
      userId,
      name: name.trim(),
      _id: { $ne: id }, // exclude current document
    });

    if (duplicate) {
      return res.status(400).json({ message: "Payment type already exists." });
    }

    existingType.name = name.trim();
    await existingType.save();

    return res.status(200).json({
      message: "Payment type updated successfully.",
      data: existingType,
    });
  } catch (err) {
    console.error("UpdatePaymentType Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Payment
const CreatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { label, paymentTypeId } = req.body;

    if (!label) {
      return res.status(400).json({ message: "Label is required." });
    }

    const newPaymentTitle = await PaymentModel.create({
      userId,
      label: label.trim(),
      paymentTypeId: paymentTypeId || null,
    });

    return res.status(201).json({
      message: "Payment label created successfully.",
      data: newPaymentTitle,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Payment label already exists for this user." });
    }

    console.error("CreatePayment Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(400).json({ message: "User ID is missing" });

    const payments = await PaymentModel.find({ userId })
      .populate("paymentTypeId")
      .sort({ label: 1 })
      .lean();

    return res.status(200).json({
      message: "Payment labels fetched successfully.",
      data: payments,
    });
  } catch (err) {
    console.error("GetPayment Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeletePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Payment ID is required." });
    }

    const deleted = await PaymentModel.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Payment not found or already deleted." });
    }

    return res.status(200).json({ message: "Payment deleted successfully." });
  } catch (err) {
    console.error("DeletePayment Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdatePayment = async (req, res) => {
  try {
    const { id } = req.params; 
    const { label } = req.body;
    const userId = req.user.id;

    if (!label || !label.trim()) {
      return res.status(400).json({ message: "Label is required." });
    }

    const existingPayment = await PaymentModel.findOne({
      _id: id,
      userId,
    });

    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    // Check for duplicate label for the same user
    const duplicate = await PaymentModel.findOne({
      userId,
      label: label.trim(),
      _id: { $ne: id }, // Exclude current document
    });

    if (duplicate) {
      return res.status(400).json({ message: "Payment label already exists." });
    }

    // Update the payment details
    existingPayment.label = label.trim();

    await existingPayment.save();

    return res.status(200).json({
      message: "Payment updated successfully.",
      data: existingPayment,
    });
  } catch (err) {
    console.error("UpdatePayment Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  CreatePaymentType,
  GetPaymentType,
  DeletePaymentType,
  UpdatePaymentType,
  CreatePayment,
  GetPayment,
  DeletePayment,
  UpdatePayment,
};
