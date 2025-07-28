'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const FOMIS = [
      "Quiet Fomi", "Energy Fomi", "Emotional Fomi", "Free Fomi",
      "Wanderer Fomi", "Noisy Fomi", "Moderate Fomi", "Sensitive Fomi",
      "Care Fomi", "Homebody Fomi", "Coexist Fomi", "Balanced Fomi",
      "Night Owl Fomi", "Independent Fomi", "Collab Fomi", "Adaptive Fomi"
    ];

    const userFomis = [];
    for (let i = 1; i <= 50; i++) {
      userFomis.push({
        user_id: i,
        fomi_name: FOMIS[Math.floor(Math.random() * FOMIS.length)]
      });
    }

    await queryInterface.bulkInsert('user_fomis', userFomis, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_fomis', {
      user_id: { [Sequelize.Op.between]: [1, 50] }
    }, {});
  }
};
