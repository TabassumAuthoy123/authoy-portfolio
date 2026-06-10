const express = require('express');
const auth = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const { validate, achievementRules } = require('../middleware/validator');
const router = express.Router();

// GET /api/achievements - public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/achievements - admin only
router.post('/', auth, validate(achievementRules), async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/achievements/:id - admin only
router.put('/:id', auth, validate(achievementRules), async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/achievements/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
