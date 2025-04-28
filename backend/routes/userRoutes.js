const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For generating JWT
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail');
const { User } = require('../models');
const verifyToken = require('../middleware/authMiddleware'); // Middleware to protect routes
require('dotenv').config(); // Loads JWT_SECRET

// POST /api/users/signup - handle user registration and send verification email
router.post("/signup", async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const newUser = await User.create({ ...req.body, verification_token: token }); // Sequelize hooks handle hashing

    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({ message: "User registered! Please verify your email.", user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/users/verify - handle user verification
router.get("/verify", async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) return res.status(400).send("Invalid or expired token.");

    user.verified = true;
    user.verification_token = null;
    await user.save();

    // Instead of redirect(), return HTML with JS-based redirect
    res.send(`
      <html>
        <head>
          <title>Email Verified</title>
          <meta charset="UTF-8" />
          <script>
            setTimeout(() => {
              window.location.href = "/login.html?verified=true";
            }, 1000);
          </script>
        </head>
        <body style="font-family: Arial; text-align: center; padding-top: 50px;">
          <h2>✅ Your email has been verified!</h2>
          <p>Redirecting you to username setup...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// POST /api/users/resend-verification - resend token to unverified user
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verified) return res.status(400).json({ error: 'User is already verified' });

    // Create a new token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    user.verification_token = token;
    await user.save();

    // Resend email
    await sendVerificationEmail(user.email, token);

    res.json({ message: 'Verification email resent!' });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// POST /api/users/login - handle user login & issue JWT token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Bypass defaultScope to include password
    const user = await User.unscoped().findOne({ where: { email } });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if the user's email has been verified
    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // Prepare user data for token (you can add more fields if needed)
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Remove password before sending user object
    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: 'Login successful',
      token, // Include token in response
      user: userData,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// PUT /api/users/:id - update user info
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Prevent updating other users
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(req.body);
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/users - Fetch all users (basic info)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'age', 'gender', 'bio', 'email', 'profile_picture_url', 'created_at']
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/me - Get current user's profile (self)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }, // Hide password field
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// GET /api/users/:id - get user info
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }, // avoid exposing password
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error("GET /api/users/:id error:", error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// POST /api/users/forgot-password - Sends reset email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  // Generate token and expiration
  const token = crypto.randomBytes(32).toString('hex');
  user.reset_password_token = token;
  user.reset_password_expires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Send email (reuse your email util)
  const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;
  await sendResetPasswordEmail(user.email, resetLink);

  res.json({ message: "Password reset email sent." });
});

// POST /api/users/reset-password - Sets new password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: { [require('sequelize').Op.gt]: Date.now() }
    }
  });

  if (!user) {
    return res.status(400).json({ error: "Token invalid or expired." });
  }

  // Compare newPassword vs old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({ error: "New password cannot be the same as the previous password." });
  }
  
  user.password = newPassword;
  user.reset_password_token = null;
  user.reset_password_expires = null;

  user.changed('password', true);

  try {
    await user.save();
    res.json({ message: "Password has been reset." });
  } catch (err) {
    console.error("Error saving new password:", err);
    res.status(500).json({ error: "Failed to reset password." });
  }
});

module.exports = router;
