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
const Feedback = require("./Feedback");
const Language = require("./Language");
const UserLanguage = require("./UserLanguage");

// Initialize model associations
const models = {
  User,
  RoommatePref,
  Message,
  Like,
  Hobby,
  UserHobby,
  Feedback,
  Language,
  UserLanguage,
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