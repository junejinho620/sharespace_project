'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING(50), unique: true, allowNull: true },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: true },
      age: { type: Sequelize.INTEGER, allowNull: true },
      gender: { type: Sequelize.ENUM('male', 'female', 'non-binary', 'other'), allowNull: true },
      bio: { type: Sequelize.TEXT, allowNull: true },
      profile_picture_url: { type: Sequelize.STRING(255), allowNull: true },
      verification_token: { type: Sequelize.STRING, allowNull: true },
      verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      phone_number: { type: Sequelize.STRING(20), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};