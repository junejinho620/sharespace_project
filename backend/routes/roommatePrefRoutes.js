// routes/roommatePrefRoutes.js
const express = require('express');
const router = express.Router();
const { RoommatePref } = require('../models');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/prefs/me - Get current user's roommate preferences
router.get('/me', verifyToken, async (req, res) => {
    try {
      const prefs = await RoommatePref.findOne({ where: { user_id: req.user.id } });
  
      if (!prefs) {
        return res.status(404).json({ error: 'Preferences not found' });
      }
  
      res.json({ prefs });
    } catch (err) {
      console.error('GET /api/prefs/me error:', err);
      res.status(500).json({ error: 'Failed to fetch preferences' });
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

// PUT /api/prefs/:user_id - Update roommate preferences
router.put('/:user_id', verifyToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const prefs = await RoommatePref.findOne({ where: { user_id: userId } });

    if (!prefs) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    await prefs.update(req.body);

    res.json({ message: 'Preferences updated', prefs });
  } catch (err) {
    console.error('PUT /api/prefs/:user_id error:', err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

module.exports = router;
