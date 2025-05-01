const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const UserHobby = db.define('UserHobby', {
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  hobby_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hobbies', key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  modelName: 'UserHobby',
  tableName: 'user_hobbies',
  timestamps: false,
});

module.exports = UserHobby;
