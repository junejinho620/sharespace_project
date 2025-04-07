const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RoomListing = db.define('RoomListing', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  rent_price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  room_type: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: false,
  tableName: 'room_listings',
});

module.exports = RoomListing;
