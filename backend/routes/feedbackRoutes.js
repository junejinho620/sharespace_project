const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { Feedback } = require('../models');

// POST /api/feedback - submit feedback
router.post('/', verifyToken, async (req, res) => {
  try {
    const { satisfaction, feedback } = req.body;
    if (!satisfaction || !feedback) {
      return res.status(400).json({ error: 'Satisfaction and feedback text required.' });
    }

    const newFeedback = await Feedback.create({
      user_id: req.user.id,
      satisfaction,
      feedback
    });

    res.status(201).json({ message: 'Feedback submitted', feedback: newFeedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/:user_id - fetch feedback by user
router.get('/:user_id', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    if (parseInt(user_id) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const feedback = await Feedback.findOne({ where: { user_id } });
    if (!feedback) return res.status(404).json({ feedback: {} });

    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
