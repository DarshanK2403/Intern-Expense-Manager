const Vendor = require("../models/Vendor");

const AddVendor = async (req, res) => {
  const { userId } = req.params;
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
    }
    const createVendor = await Vendor.create(
      data
    );
    res.status(200).json(createVendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetVendor = async (req, res) => {
  const { userId } = req.params;
  try {
    const getvendor = await Vendor.find({ userId });
    res.status(200).json(getvendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({ message: "Vendor deleted successfully" });
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
}

const GetVendorbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({name: vendor.name, email:vendor.email, phone:vendor.phone, category:vendor.category, notes: vendor.notes});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  AddVendor,
  GetVendor,
  GetVendorbyId,
  DeleteVendor,
  UpdateVendor,
};
