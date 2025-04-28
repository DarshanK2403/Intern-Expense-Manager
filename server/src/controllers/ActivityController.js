const ActivityLog = require("../models/ActivityLog")

const getActivityLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await ActivityLog.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  getActivityLog,
};
