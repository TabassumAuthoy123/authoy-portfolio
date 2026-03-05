const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: false }, // Kept for backward compatibility
  imageUrls: [{ type: String }], // New field for multiple images
  category: { type: String, default: 'design' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
