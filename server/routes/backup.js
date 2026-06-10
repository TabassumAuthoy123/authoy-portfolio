const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// GET /api/backup/export — Export all data as JSON
router.get('/export', auth, async (req, res) => {
  try {
    const collections = ['projects', 'skills', 'experiences', 'achievements',
      'leaderships', 'articles', 'galleryitems', 'profiles', 'sitesettings'];

    const backup = {};
    for (const name of collections) {
      const model = mongoose.connection.collection(name);
      backup[name] = await model.find({}).toArray();
    }

    backup.exportedAt = new Date().toISOString();
    backup.version = '1.0.0';

    res.setHeader('Content-Disposition', `attachment; filename=portfolio-backup-${Date.now()}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.json(backup);
  } catch (error) {
    res.status(500).json({ message: 'Backup failed: ' + error.message });
  }
});

// POST /api/backup/import — Import JSON backup
router.post('/import', auth, async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.version) {
      return res.status(400).json({ message: 'Invalid backup format' });
    }

    const results = {};
    const collections = ['projects', 'skills', 'experiences', 'achievements',
      'leaderships', 'articles', 'galleryitems', 'profiles', 'sitesettings'];

    for (const name of collections) {
      if (data[name] && Array.isArray(data[name]) && data[name].length > 0) {
        const collection = mongoose.connection.collection(name);
        // Remove _id fields to avoid conflicts
        const docs = data[name].map(doc => {
          const { _id, ...rest } = doc;
          return rest;
        });
        await collection.deleteMany({});
        const result = await collection.insertMany(docs);
        results[name] = result.insertedCount;
      }
    }

    res.json({
      message: 'Backup imported successfully',
      importedCollections: results,
    });
  } catch (error) {
    res.status(500).json({ message: 'Import failed: ' + error.message });
  }
});

module.exports = router;
