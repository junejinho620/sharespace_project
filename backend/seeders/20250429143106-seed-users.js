'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('Password123', 10);

    const genders       = ['male','female','prefer-not-to-say'];
    const ages          = ['18-20','21-25','26-30','31-35','36-40','over-40'];
    const nationalities = ['Korean','Canadian','Indonesian','American','Other'];
    const cities        = ['Toronto','Vancouver','Montreal','Calgary','Ottawa'];

    const users = [];
    for (let i = 1; i <= 50; i++) {
      users.push({
        username:             `testuser${i}`,
        email:                `testuser${i}@example.com`,
        name:                 `Test User ${i}`,
        gender:               genders[Math.floor(Math.random()*genders.length)],
        age:                  ages[Math.floor(Math.random()*ages.length)],
        occupation:           `Occupation ${i}`,
        nationality:          nationalities[Math.floor(Math.random()*nationalities.length)],
        cultural:             null,
        bio:                  `This is a bio for test user ${i}.`,
        profile_picture_url:  null,
        verification_token:   null,
        verified:             false,
        phone_number:         `555-000-${String(i).padStart(4,'0')}`,
        city:                 cities[Math.floor(Math.random()*cities.length)],
        reset_password_token: null,
        reset_password_expires: null,
        created_at:           new Date(),
        updated_at:           new Date(),
        deleted_at:           null
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      username: { [Sequelize.Op.like]: 'testuser%' }
    }, {});
  }
};
