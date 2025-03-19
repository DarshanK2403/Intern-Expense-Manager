const express = require("express");
const router = express.Router();
const AdminController = require('../controllers/AdminController')

router.get('/user-details', AdminController.UserDetails)

module.exports = router