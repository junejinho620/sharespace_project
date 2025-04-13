const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const RoommatePref = db.define('RoommatePref', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  budget_range: { type: DataTypes.STRING(50) },
  cleanliness: { type: DataTypes.INTEGER },
  noise_tolerance: { type: DataTypes.INTEGER },
  sleep_schedule: { type: DataTypes.STRING(50) },
  age_range: { type: DataTypes.STRING(50) },
  gender_pref: {
    type: DataTypes.ENUM('Male', 'Female', 'Any'),
    defaultValue: 'Any',
  },
  smoking: { type: DataTypes.BOOLEAN, defaultValue: false },
  introvert: { type: DataTypes.BOOLEAN, defaultValue: false },
  pet_friendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  hobbies: { type: DataTypes.TEXT },
}, {
  modelName: 'RoommatePref',
  tableName: 'roommate_prefs',
  timestamps: false,
});

// Associations
RoommatePref.associate = (models) => {
  RoommatePref.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
  });
};

module.exports = RoommatePref;