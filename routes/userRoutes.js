const express = require("express"); // Import Express for routing
const router = express.Router();
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import JWT for authentication
const User = require("../models/User"); // Import User model

// User signup (registration)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; // Get user input

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;