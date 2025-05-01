"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database.js");

// Import all model files manually
const User = require("./User");
const RoommatePref = require("./RoommatePref");
const Message = require("./Message");
const Like = require("./Like");
const Hobby = require("./Hobby");
const UserHobby = require("./UserHobby");

// Initialize model associations
const models = {
  User,
  RoommatePref,
  Message,
  Like,
  Hobby,
  UserHobby,
};

// Call associate functions if defined
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

// Export the models and Sequelize instance
module.exports = {
  ...models,
  sequelize: db,
  Sequelize,
};