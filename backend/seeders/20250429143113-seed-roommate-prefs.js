'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const budgetOptions = [
      '$500-$800',
      '$700-$1000',
      '$900-$1200',
      '$1000-$1500',
      '$1200-$1800'
    ];

    const prefs = [];

    for (let i = 1; i <= 30; i++) {
      prefs.push({
        user_id: i,
        gender_pref: i % 2 === 0 ? 'female' : 'male',
        age_range: '20-30',
        pet_friendly: i % 3 === 0,
        smoking: i % 4 === 0,
        budget_range: budgetOptions[i % budgetOptions.length]
      });
    }

    await queryInterface.bulkInsert('roommate_prefs', prefs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roommate_prefs', null, {});
  }
};
