'use strict';
module.exports = {
  up: async (qi, Sequelize) => {
    await qi.createTable('auth_providers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      provider: {
        type: Sequelize.ENUM('local','google','facebook','apple'),
        allowNull: false,
      },
      provider_user_id: { type: Sequelize.STRING, allowNull: true },
      password_hash:      { type: Sequelize.STRING, allowNull: true },
      created_at:         { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at:         { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (qi) => {
    await qi.dropTable('auth_providers');
  }
};
