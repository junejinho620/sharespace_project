const { DataTypes } = require('sequelize');
const db = require('../config/database');

/** @type {import('sequelize').Model} */

const Fomi = db.define('Fomi', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  traits: {
    // store the 16-dim trait vector as JSON { Introversion:5, … }
    type: DataTypes.JSON,
    allowNull: false
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  modelName: 'Fomi',
  tableName: 'fomis',
  underscored: true,
  timestamps: false,
});

Fomi.associate = models => {
  // best matches (relation_type = 'best')
  Fomi.belongsToMany(Fomi, {
    as: 'BestMatches',
    through: {
      model: models.FomiRelation,
      scope: { relation_type: 'best' }
    },
    foreignKey: 'source_fomi',
    otherKey: 'target_fomi'
  });
  // worst matches (relation_type = 'worst')
  Fomi.belongsToMany(Fomi, {
    as: 'WorstMatches',
    through: {
      model: models.FomiRelation,
      scope: { relation_type: 'worst' }
    },
    foreignKey: 'source_fomi',
    otherKey: 'target_fomi'
  });
};

module.exports = Fomi;

