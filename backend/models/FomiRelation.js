const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Fomi = require('./Fomi');

/** @type {import('sequelize').Model} */

const FomiRelation = db.define('FomiRelation', {
  source_fomi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target_fomi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  relation_type: {
    type: DataTypes.ENUM('best', 'worst'),
    allowNull: false
  }
}, {
  modelName: 'FomiRelation',
  tableName: 'fomi_relations',
  underscored: true,
  timestamps: false,
});

module.exports = FomiRelation;
