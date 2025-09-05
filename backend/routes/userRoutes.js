const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // For generating JWT
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const multer = require("multer"); // For image upload
const path = require("path");
const fs = require("fs");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const {
  User,
  RoommatePref,
  Hobby,
  Language,
  AuthProvider,
} = require("../models");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware"); // Middleware to protect routes
require("dotenv").config(); // Loads JWT_SECRET

// POST /api/users/signup - handle user registration and send verification email
router.post("/signup", async (req, res) => {
  try {
    // 1. Extract password (rest goes into User)
    const { password, ...userData } = req.body;

    // 2. Generate email verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 3. Create the User WITHOUT password
    const newUser = await User.create({
      ...userData,
      verification_token: verificationToken,
      verified: false,
    });

    // 4. Hash & store the local auth credentials
    const password_hash = await bcrypt.hash(password, 10);
    await AuthProvider.create({
      user_id: newUser.id,
      provider: "local",
      provider_user_id: null,
      password_hash,
    });

    // 5. Send verification email
    await sendVerificationEmail(newUser.email, verificationToken);

    // 6. Respond
    res.status(201).json({
      message: "User registered! Please verify your email.",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/users/verify-code
router.post("/verify-code", async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({
      where: { email, verification_token: token },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid verification code or email." });
    }

    user.verified = true;
    user.verification_token = null; // clear token after verifying
    await user.save();

    // ★ Generate a JWT so the client can call protected routes ★
    const payload = { id: user.id, email: user.email };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ message: "Email verified!", token: authToken });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Server error during verification." });
  }
});

// GET /api/users/check-username - Check username duplication
router.get("/check-username", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ where: { username } });
  res.json({ exists: !!user });
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
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.verified)
      return res.status(400).json({ error: "User is already verified" });

    // Create a new token
    const crypto = require("crypto");
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    user.verification_token = token;
    await user.save();

    // Resend email
    await sendVerificationEmail(user.email, token);

    res.json({ message: "Verification email resent!" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
});

// POST /api/users/login - handle user login & issue JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Fetch the local AuthProvider row
    const auth = await AuthProvider.findOne({
      where: { provider: "local", user_id: user.id },
    });
    if (!auth) {
      return res
        .status(401)
        .json({ error: "No local credentials. Please sign up first." });
    }

    // 3. Compare password against the hash
    const isMatch = await bcrypt.compare(password, auth.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 4. Check email verification
    if (!user.verified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    // 5. Issue JWT
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6. Return the token and user profile
    const userData = user.toJSON();
    delete userData.password; // if you still have a password field
    res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// PUT /api/users/me - update logged-in user info
router.put("/me", verifyToken, async (req, res) => {
  try {
    const allowedFields = [
      "username",
      "name",
      "gender",
      "age",
      "occupation",
      "nationality",
      "cultural",
      "bio",
      "phone_number",
      "city",
      "profile_picture_url",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update(updates);
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/users/:id - update user info
router.put("/:id", verifyToken, async (req, res) => {
  try {
    // Prevent updating other users
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update(req.body);
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/users - Fetch all users (basic info)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "name",
        "age",
        "city",
        "gender",
        "nationality",
        "bio",
        "email",
        "profile_picture_url",
        "created_at",
      ],
      include: [
        {
          model: Hobby,
          as: "hobbies",
          attributes: ["name"],
          through: { attributes: [] }, // hide join table fields
        },
        {
          model: RoommatePref,
          as: "roommatePref",
          attributes: ["budget_min", "budget_max"],
        },
      ],
    });

    // Flatten interests
    const formatted = users.map((u) => {
      const json = u.toJSON();

      return {
        id: json.id,
        username: json.username,
        name: json.name,
        age: json.age,
        city: json.city || "Unknown",
        gender: json.gender,
        nationality: json.nationality,
        bio: json.bio,
        profile_picture_url: json.profile_picture_url,
        joined_at: json.created_at,
        interests: (json.hobbies || []).map((h) => h.name).join(", "),
        budget_min: json.roommatePref?.budget_min ?? 0,
        budget_max: json.roommatePref?.budget_max ?? 0,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("❌ Failed to fetch users with associations:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch users with hobbies and prefs" });
  }
});

// GET /api/users/me - Get current user's profile (self)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Hobby, as: "hobbies" },
        { model: Language, as: "languages" },
      ],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id - get user info
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // avoid exposing password
      include: [
        { model: Hobby, as: "hobbies" },
        { model: Language, as: "languages" },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("GET /api/users/:id error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// POST /api/users/forgot-password - Sends reset email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  // Generate token and expiration
  const token = crypto.randomBytes(32).toString("hex");
  user.reset_password_token = token;
  user.reset_password_expires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Send email (reuse your email util)
  const resetLink = `http://localhost:5001/reset-password.html?token=${token}`;
  await sendResetPasswordEmail(user.email, resetLink);

  res.json({ message: "Password reset email sent." });
});

// POST /api/users/reset-password - Sets new password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  // 1️⃣ Find the user by reset token
  const user = await User.unscoped().findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: { [require("sequelize").Op.gt]: Date.now() },
    },
  });
  if (!user)
    return res.status(400).json({ error: "Token invalid or expired." });

  // 2️⃣ Lookup their local AuthProvider row
  const auth = await AuthProvider.findOne({
    where: { provider: "local", user_id: user.id },
  });
  if (!auth)
    return res.status(400).json({ error: "No local credentials found." });

  // 3️⃣ Prevent reusing same password
  const isSame = await bcrypt.compare(newPassword, auth.password_hash);
  if (isSame) {
    return res
      .status(400)
      .json({
        error: "New password cannot be the same as the previous password.",
      });
  }

  // 4️⃣ Hash & save on AuthProvider
  auth.password_hash = await bcrypt.hash(newPassword, 10);
  await auth.save();

  // 5️⃣ Clear reset fields on User
  user.reset_password_token = null;
  user.reset_password_expires = null;
  await user.save();

  res.json({ message: "Password has been reset." });
});

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/profile_pictures/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "user-" + req.params.id + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// PUT /api/users/:id/setup - Setup username and profile photo
router.put(
  "/:id/setup",
  verifyToken,
  upload.single("profile_picture"),
  async (req, res) => {
    try {
      if (parseInt(req.params.id) !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const updates = { username: req.body.username };

      // If a file is uploaded, set URL path
      if (req.file) {
        updates.profile_picture_url = req.file.path
          .replace(/\\/g, "/")
          .replace("uploads/", "/uploads/");
      }

      await user.update(updates);

      res.json({ message: "Account setup complete!", user });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

// GET /api/users/me/completion - Calculate the user's profile completion percentage
router.get("/me/completion", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1) Define your required core profile fields
    const profileFields = [
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "gender",
      "photoUrl",
    ];

    // 2) Define your required preference fields (from userinfo-steps)
    const prefFields = [
      "work_hours",
      "bedtime",
      "noise",
      "cleanliness",
      "clean_freq",
    ];

    // 3) Fetch the user and their prefs
    const [user, prefs] = await Promise.all([
      User.findByPk(userId),
      RoommatePref.findOne({ where: { user_id: userId } }),
    ]);

    // 4) Count how many fields are non‐empty
    let filled = 0;
    const incomplete = [];

    profileFields.forEach((f) => {
      if (user[f] !== null && user[f] !== "") {
        filled++;
      } else {
        incomplete.push(f);
      }
    });

    prefFields.forEach((f) => {
      if (prefs && prefs[f] !== null && prefs[f] !== "") {
        filled++;
      } else {
        incomplete.push(f);
      }
    });

    const total = profileFields.length + prefFields.length;
    const percent = Math.round((filled / total) * 100);

    return res.json({ percent, incompleteFields: incomplete });
  } catch (err) {
    console.error("Error computing completion:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Hobby-related routes
router.get("/:id/hobbies", userController.getUserHobbies);
router.put("/:id/hobbies", verifyToken, userController.updateUserHobbies);

// Language‐related routes
router.get("/:id/languages", userController.getUserLanguages);
router.put("/:id/languages", verifyToken, userController.updateUserLanguages);

module.exports = router;
