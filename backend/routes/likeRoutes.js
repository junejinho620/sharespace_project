const express = require('express');
const router = express.Router();
const { Like } = require('../models');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/likes/ - like other users
router.post('/', verifyToken, async (req, res) => {
  const liker_id = req.user.id;
  const { liked_id } = req.body;

  if (!liked_id || liker_id === liked_id) {
    return res.status(400).json({ error: "Invalid liked_id" });
  }

  try {
    const [like, created] = await Like.findOrCreate({
      where: { liker_id, liked_id },
      defaults: { liker_id, liked_id },
    });

    if (!created) {
      return res.status(409).json({ message: "Already liked." });
    }

    res.status(201).json({ message: "User liked successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to like user.", details: err.message });
  }
});

// GET /api/likes/matches - Get mutual matches for logged-in user
router.get('/matches', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { Like, User } = require('../models');

    const sentLikes = await Like.findAll({ where: { liker_id: userId } });
    const receivedLikes = await Like.findAll({ where: { liked_id: userId } });

    const likedIds = sentLikes.map(like => like.liked_id);
    const likerIds = receivedLikes.map(like => like.liker_id);

    const matchedUserIds = likedIds.filter(id => likerIds.includes(id));

    const matchedUsers = await User.findAll({
      where: { id: matchedUserIds },
      attributes: ['id', 'name', 'profile_picture_url'], // Adjust to fit your frontend
    });

    res.json({ matches: matchedUsers });
  } catch (err) {
    console.error("❌ Error fetching matches:", err);
    res.status(500).json({ error: 'Failed to fetch matched users' });
  }
});

// GET /api/likes/check/:likedId - Check if current user already liked someone
router.get('/check/:likedId', verifyToken, async (req, res) => {
  const liker_id = req.user.id;
  const liked_id = parseInt(req.params.likedId, 10);

  try {
    const { Like } = require('../models');
    const existingLike = await Like.findOne({
      where: { liker_id, liked_id }
    });

    if (existingLike) {
      res.json({ liked: true });
    } else {
      res.json({ liked: false });
    }
  } catch (err) {
    console.error("❌ Error checking like status:", err);
    res.status(500).json({ error: 'Failed to check like status' });
  }
});

module.exports = router;
