const { User, Hobby } = require("../models");

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
