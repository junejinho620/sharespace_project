
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // On Windows, change to bcrypt
const db = require('../config/database');

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').Sequelize} Sequelize
 */

/** @type {Model} */
const User = db.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: true },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: { isEmail: { msg: 'Must be a valid email address' } },
  },
  name: { type: DataTypes.STRING(100), allowNull: true },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'prefer-not-to-say'),
    allowNull: true,
  },
  age: {
    type: DataTypes.ENUM('18-20', '21-25', '26-30', '31-35', '36-40', 'over-40'),
    allowNull: true,
  },
  occupation: { type: DataTypes.STRING(64), allowNull: true },
  nationality: { type: DataTypes.STRING(64), allowNull: true },
  cultural: { type: DataTypes.STRING(64), allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  profile_picture_url: { type: DataTypes.STRING(255), allowNull: true },
  verification_token: { type: DataTypes.STRING, allowNull: true },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
  phone_number: { type: DataTypes.STRING(20), allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  reset_password_token: { type: DataTypes.STRING, allowNull: true },
  reset_password_expires: { type: DataTypes.DATE, allowNull: true },
}, {
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
});

// Associations
User.associate = (models) => {
  User.hasOne(models.RoommatePref, {
    foreignKey: 'user_id',
    as: 'roommatePref',
    onDelete: 'CASCADE',
  });

  User.hasMany(models.Message, {
    foreignKey: 'sender_id',
    as: 'sentMessages',
    onDelete: 'CASCADE',
  });

  User.hasMany(models.Message, {
    foreignKey: 'receiver_id',
    as: 'receivedMessages',
    onDelete: 'CASCADE',
  });

  User.hasMany(models.Like, {
    foreignKey: 'liker_id',
    as: 'likesSent',
    onDelete: 'CASCADE',
  });

  User.hasMany(models.Like, {
    foreignKey: 'liked_id',
    as: 'likesReceived',
    onDelete: 'CASCADE',
  });

  User.belongsToMany(models.Hobby, {
    through: 'UserHobby',
    foreignKey: 'user_id',
    otherKey: 'hobby_id',
    as: 'hobbies'
  });

  User.belongsToMany(models.Language, {
    through: 'UserLanguage',
    foreignKey: 'user_id',
    otherKey: 'language_id',
    as: 'languages'
  });

  User.hasMany(models.Feedback, {
    foreignKey: 'user_id',
    as: 'feedbacks',
    onDelete: 'CASCADE',
  });

  User.hasMany(models.AuthProvider, {
    foreignKey: 'user_id',
    as: 'authProviders',
    onDelete: 'CASCADE',
  });
};

module.exports = User;
