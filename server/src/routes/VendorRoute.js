const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/VendorController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

router.post("/add-vendor", VendorController.AddVendor);

router.get("/get-vendor", VendorController.GetVendor);

router.delete("/delete-vendors", VendorController.DeleteVendors);

router.get("/get-vendor-by-id/:id", VendorController.GetVendorbyId);

router.put("/update-vendor/:id", VendorController.UpdateVendor);

router.get("/vendor-expense/:id", VendorController.VendorExpense);

module.exports = router;
