const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/VendorController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-vendor", authMiddleware, VendorController.AddVendor);

router.get("/get-vendor", authMiddleware, VendorController.GetVendor);

router.delete("/delete-vendor/:id", VendorController.DeleteVendor);

router.get("/get-vendor-by-id/:id", VendorController.GetVendorbyId);

router.put("/update-vendor/:id", VendorController.UpdateVendor);

module.exports = router;
