'use strict';

const cities = [
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa',
  'Seoul', 'New York', 'Los Angeles', 'Chicago', 'San Francisco'
];

const genders = ['male', 'female'];

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    for (let i = 1; i <= 30; i++) {
      users.push({
        name: `TestUser${i}`,
        email: `testuser${i}@example.com`,
        password: '$2b$10$XzRHAbYjeEk1Fl9MWPeDd.O7VFE7Y8Ynr7uKiSEx23g8GJQJeRIJq',
        age: Math.floor(Math.random() * 15) + 20, // age 20-34
        gender: genders[i % 2],
        phone_number: `123-456-78${String(i).padStart(2, '0')}`,
        city: cities[i % cities.length],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
    }

    try {
      await queryInterface.bulkInsert('users', users);
    } catch (error) {
      console.error('❌ Seeder failed:', error.errors || error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
