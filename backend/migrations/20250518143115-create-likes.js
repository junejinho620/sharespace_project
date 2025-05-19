'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('likes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      liker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      liked_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('likes');
  }
};
