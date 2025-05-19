const { User, Hobby, Language } = require("../models");

// GET /api/users/:id/hobbies - Return the list of hobby IDs the user has selected
exports.getUserHobbies = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Hobby, as: "hobbies", through: { attributes: [] } }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.hobbies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/users/:id/hobbies - Replace the user’s selected hobbies with the new set of hobby IDs
exports.updateUserHobbies = async (req, res) => {
  if (req.user.id !== Number(req.params.id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  try {
    const { hobbyIds } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Replace existing hobbies
    await user.setHobbies(hobbyIds);
    res.json({ message: "Hobbies updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET  /api/users/:id/languages  – fetch this user’s selected languages
exports.getUserLanguages = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Language,
        as: 'languages',
        through: { attributes: [] },    // hide join‐table fields
        association: 'languages'
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // returns an array like [{ id, name }, …]
    res.json(user.languages);
  } catch (error) {
    console.error('Error fetching user languages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT  /api/users/:id/languages  – overwrite this user’s languages
exports.updateUserLanguages = async (req, res) => {
  try {
    // only allow a user to update their own languages
    if (parseInt(req.params.id, 10) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { languageIds } = req.body;
    if (!Array.isArray(languageIds)) {
      return res.status(400).json({ error: 'languageIds must be an array of IDs' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // This will delete old entries in user_languages and insert the new set
    await user.setLanguages(languageIds);

    // Fetch the fresh list to return
    const updated = await user.getLanguages();
    res.json(updated);
  } catch (error) {
    console.error('Error updating user languages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};