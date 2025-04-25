const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const { Op } = require('sequelize');

// Combine User and RoommatePref into a unified profile string
const buildProfileString = (user, prefs) => {
  return `${user.bio || ''} Age: ${user.age}, Gender: ${user.gender}. ` +
         `Budget: ${prefs?.budget_range || 'N/A'}, ` +
         `Pet friendly: ${prefs?.pet_friendly ? 'yes' : 'no'}, ` +
         `Cleanliness: ${prefs?.cleanliness}/5, ` +
         `Noise Tolerance: ${prefs?.noise_tolerance}/5, ` +
         `Sleep Schedule: ${prefs?.sleep_schedule || 'N/A'}, ` +
         `Hobbies: ${prefs?.hobbies || ''}, ` +
         `Introvert: ${prefs?.introvert ? 'yes' : 'no'}, ` +
         `Smoking: ${prefs?.smoking ? 'yes' : 'no'}.`;
};

// POST /api/recommendations/ - send all profiles to Flask for similarity matrix
router.post('/', async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: { model: db.RoommatePref, as: 'roommatePref' }
    });

    const profiles = {};
    users.forEach(user => {
      profiles[user.id.toString()] = buildProfileString(user, user.roommatePref);
    });

    const flaskResponse = await axios.post('http://127.0.0.1:5001/recommend_profiles', { profiles });
    res.json(flaskResponse.data);
  } catch (err) {
    console.error('❌ Recommendation error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// GET /api/recommendations/top/:username - get top N matches for a user
router.get('/top/:username', async (req, res) => {
  const { username } = req.params;
  const N = parseInt(req.query.topN) || 5;

  try {
    const user = await db.User.findOne({
      where: { username },
      include: { model: db.RoommatePref, as: 'roommatePref' }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const users = await db.User.findAll({
      include: { model: db.RoommatePref, as: 'roommatePref' }
    }); 

    const profiles = {};
    users.forEach(u => {
      profiles[u.id.toString()] = buildProfileString(u, u.roommatePref);
    });

    const flaskResponse = await axios.post('http://127.0.0.1:5001/recommend_profiles', { profiles });
    const similarityData = flaskResponse.data[user.id.toString()];

    if (!similarityData) {
      return res.status(404).json({ error: 'User not found in similarity data.' });
    }

    const topRecommendations = Object.entries(similarityData)
      .filter(([id]) => id !== user.id.toString())
      .sort(([, a], [, b]) => b - a)
      .slice(0, N)
      .map(([id, score]) => {
        const matchedUser = users.find(u => u.id.toString() === id);
        return {
          id: matchedUser?.id,
          username: matchedUser?.username,
          name: matchedUser?.name,
          score
        };
      });

    res.json({ user: username, topRecommendations });
  } catch (err) {
    console.error('❌ Top match error:', err);
    res.status(500).json({ error: 'Failed to fetch top recommendations' });
  }
});

module.exports = router;