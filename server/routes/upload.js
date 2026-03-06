const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return uniqueSuffix;
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public
router.post('/', (req, res) => {
  // Debug log Cloudinary config (masked)
  console.log('Using Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING');

  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        message: 'Multer error during upload', 
        error: err.message 
      });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(500).json({ 
        message: 'Upload failed', 
        error: err.message || 'Unknown error occurred',
        raw: JSON.stringify(err)
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Cloudinary returns the full URL in req.file.path
      console.log('Upload successful:', req.file.path);
      res.json({ 
        url: req.file.path, 
        message: 'File uploaded successfully' 
      });
    } catch (sendError) {
      console.error('Error sending response:', sendError);
      res.status(500).json({ message: 'Error processing upload response' });
    }
  });
});

module.exports = router;
