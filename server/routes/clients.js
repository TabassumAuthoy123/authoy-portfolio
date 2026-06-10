const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const crypto = require('crypto');
const Client = require('../models/Client');
const { validate, clientRules } = require('../middleware/validator');

// GET /api/clients — List all clients
router.get('/', auth, async (req, res) => {
  try {
    const { status, plan, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (plan) filter.plan = plan;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [clients, total] = await Promise.all([
      Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Client.countDocuments(filter),
    ]);

    res.json({
      clients,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/clients/portal/me — Fetch B2B client's own info and messages via API key
router.get('/portal/me', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ message: 'API Key is required' });
    }

    const client = await Client.findOne({ apiKey });
    if (!client) {
      return res.status(401).json({ message: 'Invalid API Key' });
    }

    const Message = require('../models/Message');
    const messages = await Message.find({ clientId: client._id }).sort({ createdAt: -1 });

    res.json({
      client,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/clients/:id — Get single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/clients — Create client
router.post('/', auth, validate(clientRules), async (req, res) => {
  try {
    const apiKey = 'pk_' + crypto.randomBytes(24).toString('hex');
    const client = await Client.create({ ...req.body, apiKey });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/clients/:id — Update client
router.put('/:id', auth, validate(clientRules), async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/clients/:id — Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/clients/:id/regenerate-key — Regenerate API key
router.post('/:id/regenerate-key', auth, async (req, res) => {
  try {
    const newKey = 'pk_' + crypto.randomBytes(24).toString('hex');
    const client = await Client.findByIdAndUpdate(req.params.id, { apiKey: newKey }, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ apiKey: newKey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
