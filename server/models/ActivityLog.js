const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'login', 'logout', 'password_change', 'settings_update', 'backup', 'restore'],
    required: true,
  },
  resourceType: {
    type: String,
    enum: ['project', 'skill', 'experience', 'achievement', 'leadership', 'article', 'gallery', 'message', 'profile', 'settings', 'admin', 'system'],
    required: true,
  },
  resourceId: { type: String, default: '' },
  resourceTitle: { type: String, default: '' },
  adminEmail: { type: String, default: 'admin' },
  details: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
}, { timestamps: true });

// Auto-expire logs after 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
