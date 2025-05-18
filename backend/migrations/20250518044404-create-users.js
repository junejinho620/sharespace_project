'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING(50), unique: true, allowNull: true },
      email: { type: Sequelize.STRING(100), unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: true },
      gender: { type: Sequelize.ENUM('male', 'female', 'prefer-not-to-say'), allowNull: true },
      age: { type: Sequelize.ENUM('18-20', '21-25', '26-30', '31-35', '36-40', 'over-40'), allowNull: true },
      occupation: { type: Sequelize.STRING(64), allowNull: true },
      nationality: { type: Sequelize.STRING(64), allowNull: true },
      cultural: { type: Sequelize.STRING(64), allowNull: true },
      bio: { type: Sequelize.TEXT, allowNull: true },
      profile_picture_url: { type: Sequelize.STRING(255), allowNull: true },
      verification_token: { type: Sequelize.STRING, allowNull: true },
      verified: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: true },
      phone_number: { type: Sequelize.STRING(20), allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      reset_password_token: { type: Sequelize.STRING, allowNull: true },
      reset_password_expires: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
