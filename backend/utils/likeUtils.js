const { Like } = require('../models');

/**
 * Checks if two users have mutually liked each other.
 * @param {number} userA - First user ID (e.g., sender).
 * @param {number} userB - Second user ID (e.g., receiver).
 * @returns {Promise<boolean>} - True if both users have liked each other.
 */
async function checkMutualLike(userA, userB) {
  const [like, reciprocalLike] = await Promise.all([
    Like.findOne({ where: { liker_id: userA, liked_id: userB } }),
    Like.findOne({ where: { liker_id: userB, liked_id: userA } }),
  ]);

  return !!(like && reciprocalLike);
}

module.exports = {
  checkMutualLike,
};