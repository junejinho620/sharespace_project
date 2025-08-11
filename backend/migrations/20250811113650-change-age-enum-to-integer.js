'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change age column from ENUM to INTEGER
    await queryInterface.changeColumn('Users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert age column back to ENUM
    await queryInterface.changeColumn('Users', 'age', {
      type: Sequelize.ENUM('18-20', '21-25', '26-30', '31-35', '36-40', 'over-40'),
      allowNull: true
    });
  }
};