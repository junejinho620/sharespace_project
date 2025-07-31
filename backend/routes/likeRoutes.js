const express = require('express');
const router = express.Router();
const { Like, User, Message } = require('../models');
const { Op } = require('sequelize');
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
    // Find sent and received likes
    const sentLikes = await Like.findAll({ where: { liker_id: userId } });
    const receivedLikes = await Like.findAll({ where: { liked_id: userId } });

    const likedIds = sentLikes.map(like => like.liked_id);
    const likerIds = receivedLikes.map(like => like.liker_id);

    // Find matched user IDs
    const matchedUserIds = likedIds.filter(id => likerIds.includes(id));

    // Fetch matched users
    const matchedUsers = await User.findAll({
      where: { id: matchedUserIds },
      attributes: ['id', 'username', 'profile_picture_url'], // Adjust to fit your frontend
    });

    // For each matched user, find latest message
    const matchesWithLastMessage = await Promise.all(
      matchedUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { sender_id: userId, receiver_id: user.id },
              { sender_id: user.id, receiver_id: userId },
            ],
          },
          order: [['sent_at', 'DESC']],
        });

        const mutualLike = await Like.findOne({
          where: { liker_id: user.id, liked_id: userId }
        });
        return {
          id: user.id,
          username: user.username,
          profile_picture_url: user.profile_picture_url,
          last_message: lastMessage ? lastMessage.message_text : null, // Include last message if exists
          matched_at: mutualLike ? mutualLike.created_at : null
        };
      })
    );

    res.json({ matches: matchesWithLastMessage });

  } catch (err) {
    console.error("❌ Error fetching matches:", err);
    res.status(500).json({ error: 'Failed to fetch matched users' });
  }
});

// GET /api/likes/incoming - who has liked *you*
router.get('/incoming', verifyToken, async (req, res) => {
  const likedId = req.user.id;
  try {
    const incoming = await Like.findAll({
      where: { liked_id: likedId },
      include: [{ model: User, as: 'liker', attributes: ['id', 'username', 'profile_picture_url'] }],
      order: [['created_at', 'DESC']]
    });
    // map to a simple shape
    const likes = incoming.map(l => ({
      liker: l.liker,
      createdAt: l.created_at
    }));
    res.json(likes);
  } catch (err) {
    console.error('❌ Error fetching incoming likes:', err);
    res.status(500).json({ error: 'Failed to fetch incoming likes' });
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
