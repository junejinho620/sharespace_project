const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const Hobby = db.define('Hobby', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  icon: { type: DataTypes.STRING(10), allowNull: false }, // e.g. '🎮'
  category: { type: DataTypes.STRING(50), allowNull: true }, // optional grouping
}, {
  modelName: 'Hobby',
  tableName: 'hobbies',
  timestamps: false,
});

Hobby.associate = (models) => {
  Hobby.belongsToMany(models.User, {
    through: 'UserHobby',
    foreignKey: 'hobby_id',
    otherKey: 'user_id',
    as: 'users'
  });
};

module.exports = Hobby;
