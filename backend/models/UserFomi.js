const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const UserFomi = db.define('UserFomi', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  fomi_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  modelName: 'UserFomi',
  tableName: 'user_fomis',
  underscored: true,
  timestamps: false,
});

UserFomi.associate = models => {
  UserFomi.belongsTo(models.User, { foreignKey: 'user_id' });
  UserFomi.belongsTo(models.Fomi, { foreignKey: 'fomi_name', targetKey: 'name' });
};

module.exports = UserFomi;

