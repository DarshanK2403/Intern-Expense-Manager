const Vendor = require("../models/Vendor");
const Expense = require("../models/ExpenseModel");
const { default: mongoose } = require("mongoose");

const AddVendor = async (req, res) => {
  const userId = req.user.id;
  try {
    const { name, email, phone, category, notes } = req.body;
    if (!name) {
      return res.status(400).json({ message: "vendor name is required" });
    }
    const vendorExist = await Vendor.findOne({ name });
    if (vendorExist) {
      return res.status(400).json({ message: "Vendor alredy exist" });
    }
    const data = {
      ...req.body,
      userId,
    };
    const createVendor = await Vendor.create(data);
    res.status(200).json(createVendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetVendor = async (req, res) => {
  const userId = req.user.id;
  try {
    const getvendor = await Vendor.find({ userId }).populate("category");
    res.status(200).json(getvendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteVendors = async (req, res) => {
  const { ids } = req.body; // Expecting an array of vendor IDs
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No vendor IDs provided" });
    }

    const result = await Vendor.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No vendors were deleted" });
    }

    res.status(200).json({
      message: "Vendors deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetVendorbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id).populate("category");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      notes: vendor.notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const VendorExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expenses = await Expense.aggregate([
      {
        $match: {
          vendor: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      { $unwind: "$vendorDetails" },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "payments",
          localField: "paymentThrough",
          foreignField: "_id",
          as: "paymentDetails",
        },
      },
      {
        $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({ expenses });
  } catch (error) {
    console.error("VendorExpense Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AddVendor,
  GetVendor,
  GetVendorbyId,
  DeleteVendors,
  UpdateVendor,
  VendorExpense,
};
