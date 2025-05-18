'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roommate_prefs', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      budget_min: { type: Sequelize.INTEGER },
      budget_max: { type: Sequelize.INTEGER },
      stay: { type: Sequelize.ENUM('<3', '3-6', '6-12', '>12') },
      work_hours: { type: Sequelize.ENUM('morning', 'standard', 'evening', 'varies') },
      wfh_days: { type: Sequelize.INTEGER },
      bedtime: { type: Sequelize.ENUM('before-10', '10-11', '11-12', 'after-mid') },
      noise: { type: Sequelize.INTEGER },
      cleanliness: { type: Sequelize.ENUM('very-tidy', 'moderate', 'relaxed') },
      clean_freq: { type: Sequelize.ENUM('weekly', 'biweekly', 'monthly', 'as-needed') },
      pets: { type: Sequelize.ENUM('has-pets', 'allergic', 'none') },
      smoking: { type: Sequelize.ENUM('yes', 'occasionally', 'no') },
      alcohol: { type: Sequelize.ENUM('never', 'rarely', 'socially', 'often') },
      diet: { type: Sequelize.JSON },
      kitchen_sharing: { type: Sequelize.ENUM('share-food-cookware', 'share-cookware', 'keep-separate') },
      bathroom: { type: Sequelize.ENUM('fine', 'private', 'depends') },
      own_guest_freq: { type: Sequelize.ENUM('never', 'occasionally', 'regular', 'flexible') },
      roommate_guest: { type: Sequelize.ENUM('anytime', 'occasionally', 'minimal') },
      social_vibe: { type: Sequelize.INTEGER },
      roommate_gender: { type: Sequelize.ENUM('male', 'female', 'non-binary', 'no-pref') },
      lgbtq: { type: Sequelize.ENUM('yes', 'no', 'prefer-not') },
      allergies: { type: Sequelize.JSON },
      allergy_custom: { type: Sequelize.STRING(100) },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('roommate_prefs');
  }
};
