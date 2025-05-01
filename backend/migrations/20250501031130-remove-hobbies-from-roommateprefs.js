"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn("roommate_prefs", "hobbies");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("roommate_prefs", "hobbies", {
      type: Sequelize.TEXT,
    });
  },
};
