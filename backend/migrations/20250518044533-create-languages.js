'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('languages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(64), allowNull: false, unique: true },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('languages');
  }
};
