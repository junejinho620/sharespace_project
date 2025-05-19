// routes/roommatePrefRoutes.js
const express = require('express');
const router = express.Router();
const { RoommatePref } = require('../models');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/prefs/me - Get roommate preferences for logged-in user
router.get('/me', verifyToken, async (req, res) => {
  try {
    let prefs = await RoommatePref.findOne({ where: { user_id: req.user.id } });
    if (!prefs) prefs = await RoommatePref.create({ user_id: req.user.id });
    res.json({ prefs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prefs/:user_id - Get a user's roommate preferences
router.get('/:user_id', verifyToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const prefs = await RoommatePref.findOne({ where: { user_id: userId } });

    if (!prefs) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    res.json({ prefs });
  } catch (err) {
    console.error('GET /api/prefs/:user_id error:', err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// POST /api/prefs - Create roommate preferences
router.post('/', verifyToken, async (req, res) => {
  try {
    const existing = await RoommatePref.findOne({ where: { user_id: req.user.id } });
    if (existing) {
      return res.status(400).json({ error: 'Preferences already exist. Use PUT to update.' });
    }

    const newPrefs = await RoommatePref.create({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(201).json({ message: 'Preferences created', prefs: newPrefs });
  } catch (err) {
    console.error('POST /api/prefs error:', err);
    res.status(500).json({ error: 'Failed to create preferences' });
  }
});

// PUT /api/prefs/me - Update roommate preferences
router.put('/me', verifyToken, async (req, res) => {
  try {
    const allowedFields = ['budget_min', 'budget_max', 'stay', 'work_hours', 'wfh_days', 'bedtime', 'noise', 'cleanliness', 'clean_freq', 'pets', 'smoking', 'alcohol', 'diet', 'kitchen_sharing', 'bathroom', 'own_guest_freq', 'roommate_guest', 'social_vibe', 'roommate_gender', 'lgbtq', 'allergies', 'allergy_custom'];
    const updates = {};

    // Normalize multi-select array fields (handle checkboxes)
    ['diet', 'allergies'].forEach(key => {
      if (req.body[key]) {
        if (Array.isArray(req.body[key])) {
          req.body[key] = req.body[key].filter(Boolean);
        } else if (typeof req.body[key] === 'string') {
          req.body[key] = [req.body[key]];
        }
      }
    });

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    ['budget_min', 'budget_max', 'wfh_days', 'noise', 'social_vibe'].forEach(key => {
      if (updates[key] !== undefined) {
        updates[key] = updates[key] === '' ? null : Number(updates[key]);
      }
    });

    let prefs = await RoommatePref.findOne({ where: { user_id: req.user.id } });
    if (!prefs) {
      prefs = await RoommatePref.create({ user_id: req.user.id, ...updates });
      return res.status(201).json({ message: 'Preferences created', prefs });
    }

    await prefs.update(updates);
    res.json({ message: 'Preferences updated', prefs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
