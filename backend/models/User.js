
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isStrongPassword(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regex.test(value)) {
          throw new Error('Password must include uppercase, lowercase, and a number.');
        }
      },
    },
  },
  name: { type: DataTypes.STRING(100), allowNull: true },
  age: { type: DataTypes.INTEGER, allowNull: true },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'non-binary', 'other'),
    allowNull: true,
  },
  bio: { type: DataTypes.TEXT, allowNull: true },
  profile_picture_url: { type: DataTypes.STRING(255), allowNull: true },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
  phone_number: { type: DataTypes.STRING(20), allowNull: true },
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

// Hooks
User.beforeCreate(async (user) => {
  user.email = user.email.toLowerCase().trim();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('email')) user.email = user.email.toLowerCase().trim();
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance method
User.prototype.comparePassword = async function (input) {
  return await bcrypt.compare(input, this.password);
};

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
};

module.exports = User;
