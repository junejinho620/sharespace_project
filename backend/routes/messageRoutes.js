const express = require('express');
const router = express.Router();
const { Message, User, Like } = require('../models');
const { Op } = require('sequelize');
const verifyToken = require('../middleware/authMiddleware'); // Middleware to verify user JWT
const { checkMutualLike } = require('../utils/likeUtils');

// Middleware to verify mutual match
async function verifyMatch(req, res, next) {
  const senderId = req.user.id;
  const receiverId = req.body.receiver_id;

  if (!receiverId) {
    return res.status(400).json({ error: "receiver_id is required." });
  }

  try {
    const isMatched = await checkMutualLike(senderId, receiverId);
    if (!isMatched) {
      return res.status(403).json({ error: "You are not matched with this user." });
    }
    next();
  } catch (err) {
    console.error("❌ verifyMatch error:", err);
    res.status(500).json({ error: "Server error during match verification.", details: err.message });
  }
}

// POST /api/messages/ - send a message
router.post('/', verifyToken, verifyMatch, async (req, res) => {
  const { receiver_id, message_text } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !message_text) {
    return res.status(400).json({ error: 'Receiver ID and message text are required.' });
  }

  try {
    const message = await Message.create({ sender_id, receiver_id, message_text });
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

// GET /api/messages/inbox - fetch all messages involving the logged-in user, sort them newest-first, then pick out the most recent one per chat partner
router.get('/inbox', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    // 1) Fetch all messages where the user is sender OR receiver, newest first
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId },
        ],
      },
      include: [
        { model: User, as: 'sender',   attributes: ['id', 'name', 'username', 'profile_picture_url'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'username', 'profile_picture_url'] }
      ],
      order: [['sent_at', 'DESC']],
    });

    // 2) Build a deduplicated list of previews (one per partner)
    const seen = new Set();
    const previews = [];
    for (const msg of messages) {
      const other = msg.sender_id === userId ? msg.receiver : msg.sender;
      if (!seen.has(other.id)) {
        seen.add(other.id);
        previews.push({
          user: other,
          lastMessage: msg.message_text,
          sentAt: msg.sent_at,
        });
      }
    }

    return res.json(previews);
  } catch (err) {
    console.error('❌ Failed to fetch inbox messages:', err);
    return res.status(500).json({ error: 'Failed to fetch inbox messages', details: err.message });
  }
});

// GET /api/messages/:otherUserId - fetch conversation history between logged-in user and another user
router.get('/:otherUserId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.params.otherUserId, 10);

  try {
    const conversation = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: userId },
        ],
      },
      order: [['sent_at', 'ASC']],
    });

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages', details: err.message });
  }
});

module.exports = router;