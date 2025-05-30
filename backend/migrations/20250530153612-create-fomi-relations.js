'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fomi_relations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      source_fomi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      target_fomi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      relation_type: {
        type: Sequelize.ENUM('best','worst'),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fomi_relations');
  }
};
