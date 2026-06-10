const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
