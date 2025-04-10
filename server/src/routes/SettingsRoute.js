const express = require("express");
const router = express.Router();
const SettingController = require('../controllers/SettingController');
const authMiddleware = require("../middleware/authMiddleware");

// Unified Category Routes
router.post('/category', authMiddleware, SettingController.CreateCategory);
router.get('/category', authMiddleware, SettingController.GetCategory);
router.delete('/category/:id', authMiddleware, SettingController.DeleteCategory);

module.exports = router;
