const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, actionType, description) => {
  try {
    const activity = new ActivityLog({
      userId,
      actionType,
      description
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
