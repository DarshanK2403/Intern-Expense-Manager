const express = require("express");
const router = express.Router();
const SettingController = require('../controllers/SettingController')

router.post('/create-category/:userId', SettingController.CreateCategory)

router.get('/get-category/:userId', SettingController.GetCategory);

router.delete('/delete-category/:id', SettingController.DeleteCategory)
module.exports = router;