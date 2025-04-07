const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/database');

const User = db.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isStrongPassword(value) {
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!strongPassword.test(value)) {
          throw new Error('Password must be at least 8 characters long and include uppercase, lowercase letters, and numbers.');
        }
      },
    },
  },  
  age: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },  
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['male', 'female']],
        msg: 'Gender must be either "male" or "female"',
      },
    },
  },
  phone_number: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Soft deletes
  deletedAt: 'deleted_at',
  defaultScope: {
    attributes: { exclude: ['password'] }, // Hide password by default
  },
});

// Password hashing before create
User.beforeCreate(async (user, options) => {
  await normalizeEmail(user);
  await hashPassword(user);
});

// Password hashing before update
User.beforeUpdate(async (user, options) => {
  await normalizeEmail(user);
  if (user.changed('password')) {
    await hashPassword(user);
  }
});

// Normalize email to lowercase
async function normalizeEmail(user) {
  if (user.email) {
    user.email = user.email.toLowerCase().trim();
  }
}

// Password hashing function
async function hashPassword(user) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
}

// Instance method: password comparison
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
