const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // 🔐 For generating JWT
const { User } = require('../models');
require('dotenv').config(); // 🔑 Loads JWT_SECRET

// POST /api/users/signup - handle user registration
router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Sequelize hooks handle hashing
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
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

    // Prepare user data for token (you can add more fields if needed)
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // expires in 7 days

    // Remove password before sending user object
    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: 'Login successful',
      token, // 🔐 Include token in response
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

module.exports = router;
