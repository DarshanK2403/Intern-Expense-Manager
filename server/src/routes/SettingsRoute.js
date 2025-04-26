const express = require("express");
const router = express.Router();
const SettingController = require("../controllers/SettingController");
const authMiddleware = require("../middleware/authMiddleware");

// Unified Category Routes
router.post("/category", authMiddleware, SettingController.CreateCategory);
router.get("/category", authMiddleware, SettingController.GetCategory);
router.get(
  "/category-by-id/:id",
  authMiddleware,
  SettingController.GetCategoryById
);
router.put("/update-category/:id", authMiddleware, SettingController.UpdateCategory);
router.delete(
  "/category/:id",
  authMiddleware,
  SettingController.DeleteCategory
);

module.exports = router;
