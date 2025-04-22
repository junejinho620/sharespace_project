const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models'); // Your Sequelize setup

// POST /api/match/ - send profiles to Flask and get similarity matrix
router.post('/', async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['name', 'bio', 'age', 'gender'],
    });

    const profiles = {};
    users.forEach(user => {
      profiles[user.name] = `${user.bio}. Age: ${user.age}. Gender: ${user.gender}`;
    });

    const flaskResponse = await axios.post('http://localhost:5001/match_profiles', { profiles });

    res.json(flaskResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// GET /api/match/top/:username - fetch top N matches for a specific user
router.get('/top/:username', async (req, res) => {
  const { username } = req.params;
  const N = parseInt(req.query.topN) || 5; // Default to top 5 matches if not specified

  try {
    const users = await db.User.findAll({
      attributes: ['name', 'bio', 'age', 'gender'],
    });

    const profiles = {};
    users.forEach(user => {
      profiles[user.name] = `${user.bio}. Age: ${user.age}. Gender: ${user.gender}`;
    });

    const flaskResponse = await axios.post('http://localhost:5001/match_profiles', { profiles });

    const similarityData = flaskResponse.data[username];
    
    if (!similarityData) {
      return res.status(404).json({ error: 'User not found in similarity data.' });
    }

    // Get and sort top N matches
    const topMatches = Object.entries(similarityData)
      .filter(([name]) => name !== username)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, N)
      .map(([name, score]) => ({ name, score }));

    res.json({ user: username, topMatches });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top matches' });
  }
});

module.exports = router;
