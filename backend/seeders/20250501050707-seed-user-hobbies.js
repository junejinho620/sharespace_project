"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const userHobbies = [];

    const NUM_USERS = 30;
    const NUM_HOBBIES = 20;

    for (let userId = 1; userId <= NUM_USERS; userId++) {
      const assigned = new Set();

      const numHobbies = Math.floor(Math.random() * 3) + 1; // 1 to 3 hobbies
      while (assigned.size < numHobbies) {
        const hobbyId = Math.floor(Math.random() * NUM_HOBBIES) + 1;
        assigned.add(hobbyId);
      }

      for (const hobbyId of assigned) {
        userHobbies.push({
          user_id: userId,
          hobby_id: hobbyId,
        });
      }
    }

    await queryInterface.bulkInsert("user_hobbies", userHobbies);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_hobbies", null, {});
  },
};
