const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Starts Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login.html' }), (req, res) => {
    // Issue our JWT
    const payload = { id: req.user.id, email: req.user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Redirect to your frontend success handler with token
    const url = `${process.env.FRONTEND_URL}/social-login-success.html?token=${token}`;
    res.redirect(url);
  }
);

module.exports = router;