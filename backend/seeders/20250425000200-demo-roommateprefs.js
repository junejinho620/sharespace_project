'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roommate_prefs', [
      {
        user_id: 1,
        budget_range: '500-700',
        cleanliness: 4,
        noise_tolerance: 2,
        sleep_schedule: 'early',
        age_range: '22-28',
        gender_pref: 'Any',
        smoking: false,
        introvert: true,
        pet_friendly: true,
        hobbies: 'reading, yoga'
      },
      {
        user_id: 2,
        budget_range: '700-900',
        cleanliness: 2,
        noise_tolerance: 5,
        sleep_schedule: 'late',
        age_range: '23-30',
        gender_pref: 'Female',
        smoking: false,
        introvert: false,
        pet_friendly: false,
        hobbies: 'gaming, music'
      },
      {
        user_id: 3,
        budget_range: '500-700',
        cleanliness: 5,
        noise_tolerance: 1,
        sleep_schedule: 'early',
        age_range: '21-26',
        gender_pref: 'Male',
        smoking: false,
        introvert: true,
        pet_friendly: true,
        hobbies: 'running, baking'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roommate_prefs', null, {});
  }
};