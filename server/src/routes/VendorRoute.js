const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/VendorController")

router.post("/add-vendor/:userId", VendorController.AddVendor);

module.exports = router