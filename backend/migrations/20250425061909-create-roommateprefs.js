'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roommate_prefs', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      budget_range: Sequelize.STRING(50),
      cleanliness: Sequelize.INTEGER,
      noise_tolerance: Sequelize.INTEGER,
      sleep_schedule: Sequelize.STRING(50),
      age_range: Sequelize.STRING(50),
      gender_pref: {
        type: Sequelize.ENUM('Male', 'Female', 'Any'),
        defaultValue: 'Any'
      },
      smoking: { type: Sequelize.BOOLEAN, defaultValue: false },
      introvert: { type: Sequelize.BOOLEAN, defaultValue: false },
      pet_friendly: { type: Sequelize.BOOLEAN, defaultValue: false },
      hobbies: Sequelize.TEXT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roommate_prefs');
  }
};