const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Review = db.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  reviewer_id: { type: DataTypes.INTEGER, allowNull: false },
  reviewed_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: false,
  tableName: 'reviews',
});

module.exports = Review;
