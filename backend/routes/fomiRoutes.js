const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const verifyToken = require('../middleware/authMiddleware'); // Middleware to protect routes

// Utility mappers:
function numToLetter(n) { return String.fromCharCode(96 + Number(n)); }
// 1→a, 2→b, … 5→e

function mapCleanliness(x) {
  // adjust these strings to match exactly your DB values
  if (x === 'very-tidy') return 'a';
  if (x === 'moderately-tidy') return 'b';
  return 'c'; // 'relaxed-about-mess'
}
function mapDeepClean(x) {
  if (x === 'weekly') return 'a';
  if (x === 'biweekly') return 'b';
  if (x === 'monthly') return 'c';
  return 'd'; // 'as-needed'
}
function mapGuests(x) {
  if (x === 'anytime') return 'a';
  if (x === 'occasionally') return 'b';
  return 'c'; // 'minimal'
}
function mapBedtime(x) {
  if (x === 'before-10pm') return 'a';
  if (x === '10pm-11pm') return 'b';
  if (x === '11pm-12am') return 'c';
  return 'd'; // 'after-midnight'
}
function mapWorkHours(x) {
  if (x === 'morning') return 'a';
  if (x === 'standard') return 'b';
  if (x === 'evening') return 'c';
  return 'd'; // 'varies'
}
function mapKitchen(x) {
  if (x === 'share-food') return 'a';
  if (x === 'share-cookware') return 'b';
  return 'c'; // 'separate'
}
function mapGender(x) {
  if (x === 'male') return 'a';
  if (x === 'female') return 'b';
  if (x === 'non-binary') return 'c';
  return 'd'; // 'no-preference'
}
function mapOvernight(x) {
  if (x === 'never') return 'a';
  if (x === 'occasionally') return 'b';
  if (x === 'weekly') return 'c';
  return 'd'; // 'flexible'
}
function mapHobby(arr) {
  // arr is something like ['Gaming','Drawing',…]
  if (arr.includes('Working Out')) return 'f';
  if (arr.includes('Drawing')) return 'p';
  if (arr.includes('Reading')) return 's';
  if (arr.includes('Traveling')) return 'r';
  if (arr.includes('Baking')) return 'm';
  if (arr.includes('Meditation')) return 'h';
  // fallback to ‘s’ (reading)
  return 's';
}

// GET /api/users/me/fomi
router.get('/users/me/fomi', verifyToken, async (req, res) => {
  try {
    // 1. Load this user’s prefs
    const prefs = await db.RoommatePref.findOne({
      where: { user_id: req.user.id },
      // if you store hobbies in a separate table, join/include that here
    });
    if (!prefs) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    // 2. Translate into Q-codes
    const answers = {
      Q12: numToLetter(prefs.noise_tolerance),
      Q23: numToLetter(prefs.social_vibe || prefs.introvert),
      Q13: mapCleanliness(prefs.cleanliness),
      Q14: mapDeepClean(prefs.deep_clean_freq),
      Q22: mapGuests(prefs.guest_policy),
      Q11: mapBedtime(prefs.sleep_schedule),
      Q10: mapWorkHours(prefs.work_hours),
      Q19: mapKitchen(prefs.kitchen_sharing),
      Q24: mapGender(prefs.gender_preference),
      Q26: (prefs.allergies && prefs.allergies.length) ? 'any' : 'none',
      Q21: mapOvernight(prefs.overnight_guests),
      Q9: mapHobby(prefs.hobbies || []),
    };

    // 3. Call the Flask service
    const flaskRes = await axios.post(
      'http://127.0.0.1:5001/api/match_fomi',
      answers
    );

    const { matchedFomi } = flaskRes.data;

    // 4) Upsert into UserFomi (one-to-one)
    const [record, created] = await db.UserFomi.findOrCreate({
      where: { user_id: req.user.id },
      defaults: { fomi_name: matchedFomi }
    });

    if (!created) {
      // Already exists, so update
      await record.update({ fomi_name: matchedFomi });
    }

    // 5) Return the matched Fomi
    return res.json({ matchedFomi });
  } catch (err) {
    console.error('Fomi match error', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/fomis/:name/details - returns { name, photo_url, traits, bestMatches: [...], worstMatches: [...] }
router.get('/fomis/:name/details', async (req, res) => {
  try {
    const name = req.params.name;

    // 1) Fetch the Fomi itself
    const fomi = await db.Fomi.findByPk(name);
    if (!fomi) {
      return res.status(404).json({ error: 'Fomi not found' });
    }

    // 2) Find best matches
    const bestRows = await db.FomiRelation.findAll({
      where: {
        source_fomi: name,
        relation_type: 'best'
      }
    });
    const bestMatches = bestRows.map(r => r.target_fomi);

    // 3) Find worst matches
    const worstRows = await db.FomiRelation.findAll({
      where: {
        source_fomi: name,
        relation_type: 'worst'
      }
    });
    const worstMatches = worstRows.map(r => r.target_fomi);

    // 4) Return everything
    return res.json({
      name: fomi.name,
      photo_url: fomi.photo_url,
      traits: fomi.traits,
      bestMatches,
      worstMatches
    });
  } catch (err) {
    console.error('Error fetching Fomi details:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
