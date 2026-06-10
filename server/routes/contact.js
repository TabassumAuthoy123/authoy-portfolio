const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const { validate, contactRules } = require('../middleware/validator');
const router = express.Router();

// POST /api/contact - public (visitors send messages)
router.post('/', validate(contactRules), async (req, res) => {
  try {
    const { name, email, message, honeypot, clientId } = req.body;

    // Honeypot spam prevention — if this hidden field is filled, it's a bot
    if (honeypot) {
      return res.status(201).json({ message: 'Message sent successfully' });
    }

    const msg = await Message.create({
      name,
      email,
      message,
      clientId: clientId || null
    });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contact - admin only (view messages)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contact/:id/read - admin only (mark as read)
router.put('/:id/read', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/contact/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

