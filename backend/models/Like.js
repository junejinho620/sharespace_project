const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const Like = db.define('Like', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  liker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  liked_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  modelName: 'Like',
  tableName: 'likes',
  timestamps: false,
});

// Add associations
Like.associate = (models) => {
  Like.belongsTo(models.User, {
    foreignKey: 'liker_id',
    as: 'liker',
    onDelete: 'CASCADE',
  });

  Like.belongsTo(models.User, {
    foreignKey: 'liked_id',
    as: 'liked',
    onDelete: 'CASCADE',
  });
};

module.exports = Like;
