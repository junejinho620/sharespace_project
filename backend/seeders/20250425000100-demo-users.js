'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
        password: 'hashed123',
        name: 'Alice',
        age: 24,
        gender: 'female',
        bio: 'Loves quiet evenings and cats.',
        profile_picture_url: null,
        verification_token: null,
        verified: true,
        phone_number: '111-222-3333',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      },
      {
        id: 2,
        username: 'bob',
        email: 'bob@example.com',
        password: 'hashed123',
        name: 'Bob',
        age: 26,
        gender: 'male',
        bio: 'Gamer and night owl.',
        profile_picture_url: null,
        verification_token: null,
        verified: true,
        phone_number: '222-333-4444',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      },
      {
        id: 3,
        username: 'clara',
        email: 'clara@example.com',
        password: 'hashed123',
        name: 'Clara',
        age: 23,
        gender: 'female',
        bio: 'Early riser and coffee lover.',
        profile_picture_url: null,
        verification_token: null,
        verified: true,
        phone_number: '333-444-5555',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
