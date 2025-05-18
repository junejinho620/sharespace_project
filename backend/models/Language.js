const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const Language = db.define('Language', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(64), allowNull: false, unique: true },
}, {
  modelName: 'Language',
  tableName: 'languages',
  timestamps: false,
});

Language.belongsToMany(models.User, {
  through: 'UserLanguage',
  foreignKey: 'language_id',
  otherKey: 'user_id',
  as: 'users'
});

module.exports = Language;
