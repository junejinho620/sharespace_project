const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const Message = db.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  message_text: { type: DataTypes.TEXT, allowNull: false },
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'messages',
  timestamps: false,
});

// Associations
Message.associate = (models) => {
  Message.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender',
    onDelete: 'CASCADE',
  });

  Message.belongsTo(models.User, {
    foreignKey: 'receiver_id',
    as: 'receiver',
    onDelete: 'CASCADE',
  });
};

module.exports = Message;
