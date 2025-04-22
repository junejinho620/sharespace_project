const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const { Op } = require('sequelize');
const verifyToken = require('../middleware/authMiddleware'); // Middleware to verify user JWT

// Middleware to ensure users are matched
async function verifyMatch(req, res, next) {
  const { receiver_id } = req.body;
  const sender_id = req.user.id;

  // Here, implement your matching verification logic.
  // Example placeholder logic (adjust based on your matching implementation):
  const isMatched = await checkMatch(sender_id, receiver_id);

  if (!isMatched) {
    return res.status(403).json({ error: 'You are not matched with this user.' });
  }

  next();
}

// Placeholder matching logic (replace with actual matching logic)
async function checkMatch(sender_id, receiver_id) {
  // Example logic to check match (to be replaced with your actual matching logic)
  // Assume a `matches` table or other logic that confirms mutual likes
  // return true if matched; false otherwise
  return true;  // replace with real logic
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
