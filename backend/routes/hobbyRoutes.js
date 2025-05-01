const express = require("express");
const router = express.Router();
const { Hobby } = require("../models");

// GET /api/hobbies - Return a list of all predefined hobbies
router.get("/", async (req, res) => {
  try {
    const hobbies = await Hobby.findAll({ order: [["name", "ASC"]] });
    res.json(hobbies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
