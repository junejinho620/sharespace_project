'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('likes', [
      { id: 1, liker_id: 1, liked_id: 2, created_at: new Date() },
      { id: 2, liker_id: 2, liked_id: 1, created_at: new Date() }, // mutual match
      { id: 3, liker_id: 3, liked_id: 1, created_at: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('likes', null, {});
  }
};
