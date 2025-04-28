const express = require("express");
const router = express.Router();
const ActivityLogController = require("../controllers/ActivityController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/activity-logs",
  authMiddleware,
  ActivityLogController.getActivityLog
);

module.exports = router;
