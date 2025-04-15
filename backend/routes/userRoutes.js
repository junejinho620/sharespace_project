const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For generating JWT
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const { User } = require('../models');
require('dotenv').config(); // Loads JWT_SECRET

// POST /api/users/signup - handle user registration
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

// POST /api/users/verify - handle user verification
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
              window.location.href = "/user-name.html?verified=true&id=${user.id}";
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

// POST /api/users/login - handle user login & issue token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Bypass defaultScope to include password
    const user = await User.unscoped().findOne({ where: { email } });

    if (!user) {
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
router.put('/:id', async (req, res) => {
  console.log("Incoming PUT data:", req.body);

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(req.body);
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

module.exports = router;
