'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'city', {
      type: Sequelize.STRING,
      allowNull: true, // You can make it false if you want it to be required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'city');
  }
};
