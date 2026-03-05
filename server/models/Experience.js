const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  duration: { type: String, required: true },
  description: [{ type: String }],
  type: {
    type: String,
    enum: ['work', 'education'],
    required: true
  },
  gpa: { type: String, default: '' },
  icon: { type: String, default: '' },
  accent: { type: String, default: '' },
  summary: { type: String, default: '' },
  highlights: [{ type: String }],
  tags: [{ type: String }],
  achievements: [{ icon: String, label: String, value: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
