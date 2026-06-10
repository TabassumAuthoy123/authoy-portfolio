const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: '' },
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'starter',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'trial'],
    default: 'trial',
  },
  apiKey: { type: String, unique: true, sparse: true },
  notes: { type: String, default: '' },
  projectsDelivered: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  logo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
