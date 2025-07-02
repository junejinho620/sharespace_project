const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const AuthProvider = db.define('AuthProvider', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  provider: {
    type: DataTypes.ENUM('local', 'google', 'facebook', 'apple'),
    allowNull: false,
  },
  provider_user_id: {
    type: DataTypes.STRING,
    allowNull: true,   // e.g. Google’s `profile.id`
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true,   // only used for `local`
  },
}, {
  tableName: 'auth_providers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

AuthProvider.associate = (models) => {
  AuthProvider.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
  });
};

module.exports = AuthProvider;
