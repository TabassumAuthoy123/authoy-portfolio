const express = require('express');
const auth = require('../middleware/auth');
const Leadership = require('../models/Leadership');
const { validate, leadershipRules } = require('../middleware/validator');
const router = express.Router();

// GET /api/leadership - public
router.get('/', async (req, res) => {
  try {
    const items = await Leadership.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/leadership - admin only
router.post('/', auth, validate(leadershipRules), async (req, res) => {
  try {
    const item = await Leadership.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/leadership/:id - admin only
router.put('/:id', auth, validate(leadershipRules), async (req, res) => {
  try {
    const item = await Leadership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Leadership item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/leadership/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Leadership.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Leadership item not found' });
    res.json({ message: 'Leadership item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
