const express = require("express");
const router = express.Router();
const { Language } = require("../models");

// GET /api/languages - Return full list of languages
router.get("/", async (req, res) => {
  try {
    const languages = await Language.findAll({ order: [["name", "ASC"]] });
    res.json(languages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;