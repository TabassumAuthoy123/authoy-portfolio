const express = require('express');
const auth = require('../middleware/auth');
const Experience = require('../models/Experience');
const router = express.Router();

// GET /api/experience - public
router.get('/', async (req, res) => {
  try {
    const experience = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/experience - admin only
router.post('/', auth, async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/experience/:id - admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json(exp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/experience/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
