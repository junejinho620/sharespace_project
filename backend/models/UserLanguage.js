const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const UserLanguage = db.define('UserLanguage', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    primaryKey: true,
  },
  language_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'languages', key: 'id' },
    onDelete: 'CASCADE',
    primaryKey: true,
  },
}, {
  modelName: 'UserLanguage',
  tableName: 'user_languages',
  timestamps: false,
});

module.exports = UserLanguage;
