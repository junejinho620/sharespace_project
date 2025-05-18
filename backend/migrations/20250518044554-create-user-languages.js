'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_languages', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'languages', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_languages');
  }
};
