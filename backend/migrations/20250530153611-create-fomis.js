'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fomis', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      traits: {
        type: Sequelize.JSON,
        allowNull: false
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fomis');
  }
};
