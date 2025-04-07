const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RoommatePref = db.define('RoommatePref', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  gender_pref: { type: DataTypes.STRING, allowNull: true },
  age_range: { type: DataTypes.STRING, allowNull: true },
  pet_friendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  smoking_allowed: { type: DataTypes.BOOLEAN, defaultValue: false },
  interests: { type: DataTypes.STRING, allowNull: true },
  budget_range: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: false,
  tableName: 'roommate_prefs',
});

module.exports = RoommatePref;
