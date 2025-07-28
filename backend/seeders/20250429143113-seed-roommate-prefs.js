'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const prefs = [];

    for (let i = 1; i <= 50; i++) {
      const min = 500 + Math.floor(Math.random() * 16) * 100;  // 500, 600, …, 2100
      const max = min + (100 + Math.floor(Math.random() * 10) * 100); // at least +100

      prefs.push({
        user_id: i,
        budget_min: min,
        budget_max: max,
        stay: null,
        work_hours: null,
        wfh_days: null,
        bedtime: null,
        noise: null,
        cleanliness: null,
        clean_freq: null,
        pets: null,
        smoking: null,
        alcohol: null,
        diet: null,
        bathroom: null,
        own_guest_freq: null,
        roommate_guest: null,
        social_vibe: null,
        roommate_gender: null,
        lgbtq: null,
        allergies: null,
        allergy_custom: null,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('roommate_prefs', prefs, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roommate_prefs', {
      user_id: { [Sequelize.Op.between]: [1, 50] }
    }, {});
  }
};
