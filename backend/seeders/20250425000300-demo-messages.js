'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('messages', [
      {
        id: 1,
        sender_id: 1,
        receiver_id: 2,
        message_text: 'Hey Bob, I saw your profile. You seem cool!',
        sent_at: new Date('2025-04-25T09:00:00')
      },
      {
        id: 2,
        sender_id: 2,
        receiver_id: 1,
        message_text: 'Thanks Alice! Want to chat more?',
        sent_at: new Date('2025-04-25T09:02:00')
      },
      {
        id: 3,
        sender_id: 3,
        receiver_id: 1,
        message_text: 'Hi Alice, your hobbies match mine. Let’s connect.',
        sent_at: new Date('2025-04-25T09:05:00')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('messages', null, {});
  }
};
