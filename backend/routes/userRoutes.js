const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

// POST /api/users/signup - handle user registration
router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Automatically hashes password
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/users/login - user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope(null).findOne({ where: { email } }); // include password

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Hide password before sending user back
    const userData = user.toJSON();
    delete userData.password;

    res.json({ message: 'Login successful', user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// PUT /api/users/:id - update user info
router.put('/:id', async (req, res) => {
  console.log("Incoming PUT data:", req.body); // 🔍 ADD THIS LINE

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log("Updating user:", user.id, "with:", req.body); // 🔍 Add this

    await user.update(req.body);

    console.log("✅ Update successful for user", user.id); // 🔍 And this

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;