const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const Feedback = db.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  satisfaction: {
    type: DataTypes.INTEGER, // 1–5
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  feedback: { type: DataTypes.TEXT, allowNull: false },
}, {
  modelName: 'Feedback',
  tableName: 'feedbacks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

Feedback.associate = (models) => {
  Feedback.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
  });
};

module.exports = Feedback;
