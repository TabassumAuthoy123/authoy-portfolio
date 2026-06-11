const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['competition', 'cp', 'sports', 'publications', 'leadership', 'education', 'career', 'academic', 'research'],
    required: true 
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
