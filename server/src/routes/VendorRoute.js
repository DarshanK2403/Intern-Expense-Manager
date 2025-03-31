const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/VendorController")

router.post("/add-vendor/:userId", VendorController.AddVendor);

router.get("/get-vendor/:userId", VendorController.GetVendor);

router.delete("/delete-vendor/:id", VendorController.DeleteVendor);

module.exports = router