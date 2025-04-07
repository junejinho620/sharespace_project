'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = require('../config/database');

const User = require('./User');
const RoomListing = require('./RoomListing');
const RoommatePref = require('./RoommatePref');
const Message = require('./Message');
const Review = require('./Review');
const Payment = require('./Payment');

// Associations

// User - Room Listings
User.hasMany(RoomListing, { foreignKey: 'user_id' });
RoomListing.belongsTo(User, { foreignKey: 'user_id' });

// User - Roommate Preferences
User.hasOne(RoommatePref, { foreignKey: 'user_id' });
RoommatePref.belongsTo(User, { foreignKey: 'user_id' });

// Messages
User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });

// Reviews
User.hasMany(Review, { foreignKey: 'reviewer_id', as: 'GivenReviews' });
User.hasMany(Review, { foreignKey: 'reviewed_id', as: 'ReceivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'Reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewed_id', as: 'Reviewed' });

// Payments
User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

const sequelize = db;

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  db,
  User,
  RoomListing,
  RoommatePref,
  Message,
  Review,
  Payment,
};
