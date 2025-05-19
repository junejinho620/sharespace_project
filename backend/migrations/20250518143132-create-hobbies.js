"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("hobbies", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      icon: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("hobbies");
  },
};
