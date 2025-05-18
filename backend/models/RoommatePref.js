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

  // Budget
  budget_min: { type: DataTypes.INTEGER, allowNull: true },
  budget_max: { type: DataTypes.INTEGER, allowNull: true },
  stay: {
    type: DataTypes.ENUM('<3', '3-6', '6-12', '>12'),
    allowNull: true,
  },

  // Schedule & Noise
  work_hours: {
    type: DataTypes.ENUM('morning', 'standard', 'evening', 'varies'),
    allowNull: true,
  },
  wfh_days: { type: DataTypes.INTEGER, allowNull: true },
  bedtime: {
    type: DataTypes.ENUM('before-10', '10-11', '11-12', 'after-mid'),
    allowNull: true,
  },
  noise: { type: DataTypes.INTEGER, allowNull: true }, // 1–5

  // Cleanliness & Chores
  cleanliness: {
    type: DataTypes.ENUM('very-tidy', 'moderate', 'relaxed'),
    allowNull: true,
  },
  clean_freq: {
    type: DataTypes.ENUM('weekly', 'biweekly', 'monthly', 'as-needed'),
    allowNull: true,
  },

  // Household Preferences
  pets: {
    type: DataTypes.ENUM('has-pets', 'allergic', 'none'),
    allowNull: true,
  },
  smoking: {
    type: DataTypes.ENUM('yes', 'occasionally', 'no'),
    allowNull: true,
  },
  alcohol: {
    type: DataTypes.ENUM('never', 'rarely', 'socially', 'often'),
    allowNull: true,
  },
  diet: { type: DataTypes.JSON, allowNull: true }, // Array of selected diets

  kitchen_sharing: {
    type: DataTypes.ENUM('share-food-cookware', 'share-cookware', 'keep-separate'),
    allowNull: true,
  },

  // Bathroom & Guests
  bathroom: {
    type: DataTypes.ENUM('fine', 'private', 'depends'),
    allowNull: true,
  },
  own_guest_freq: {
    type: DataTypes.ENUM('never', 'occasionally', 'regular', 'flexible'),
    allowNull: true,
  },
  roommate_guest: {
    type: DataTypes.ENUM('anytime', 'occasionally', 'minimal'),
    allowNull: true,
  },

  // Social & Compatibility
  social_vibe: { type: DataTypes.INTEGER, allowNull: true }, // 1–5
  roommate_gender: {
    type: DataTypes.ENUM('male', 'female', 'non-binary', 'no-pref'),
    allowNull: true,
  },
  lgbtq: {
    type: DataTypes.ENUM('yes', 'no', 'prefer-not'),
    allowNull: true,
  },

  // Allergies & Health
  allergies: { type: DataTypes.JSON, allowNull: true }, // Array of allergies
  allergy_custom: { type: DataTypes.STRING(100), allowNull: true }, // for "Other"
}, {
  modelName: 'RoommatePref',
  tableName: 'roommate_prefs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
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