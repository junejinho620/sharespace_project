const { User } = require('../models');
const { Op } = require('sequelize');

async function deleteUnverifiedUsers(days = 1) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const deleted = await User.destroy({
    where: {
      verified: false,
      created_at: { [Op.lt]: cutoff }
    }
  });

  console.log(`🧹 Deleted ${deleted} unverified users`);
}

deleteUnverifiedUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Cleanup error:', err);
    process.exit(1);
  });
