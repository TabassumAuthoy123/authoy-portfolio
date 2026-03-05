const mongoose = require('mongoose');

const leadershipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, default: '' },
  role: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  icon: { type: String, default: '🏛️' },
  accent: { type: String, default: '#2dd4bf' },
  isActive: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Leadership', leadershipSchema);
