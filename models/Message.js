const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Message = db.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  receiver_id: { type: DataTypes.INTEGER, allowNull: false },
  message_text: { type: DataTypes.TEXT, allowNull: false },
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: false,
  tableName: 'messages',
});

module.exports = Message;
