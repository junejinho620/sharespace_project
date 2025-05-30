'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('fomis', [
      {
        name: "Quiet Fomi",
        traits: JSON.stringify({ "Introversion":5,"Extroversion":1,"Cleanliness":4,"Noise Tolerance":5,"Guest Tolerance":1,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":1,"Flexibility":3,"Sensitivity":3,"Caregiving":1,"Independence":4,"Teamwork":1,"Creativity":2,"Homebody":5,"Adaptability":2 }),
        photo_url: "/img/fomi/quiet-fomi.png"
      },
      {
        name: "Energy Fomi",
        traits: JSON.stringify({ "Introversion":1,"Extroversion":5,"Cleanliness":3,"Noise Tolerance":2,"Guest Tolerance":5,"Sleep Schedule":4,"Work Rhythm":4,"Social Needs":5,"Flexibility":3,"Sensitivity":2,"Caregiving":2,"Independence":1,"Teamwork":4,"Creativity":2,"Homebody":2,"Adaptability":4 }),
        photo_url: "/img/fomi/energy-fomi.png"
      },
      {
        name: "Emotional Fomi",
        traits: JSON.stringify({ "Introversion":4,"Extroversion":2,"Cleanliness":4,"Noise Tolerance":4,"Guest Tolerance":2,"Sleep Schedule":4,"Work Rhythm":3,"Social Needs":2,"Flexibility":3,"Sensitivity":5,"Caregiving":3,"Independence":2,"Teamwork":2,"Creativity":4,"Homebody":3,"Adaptability":3 }),
        photo_url: "/img/fomi/emotional-fomi.png"
      },
      {
        name: "Free Fomi",
        traits: JSON.stringify({ "Introversion":3,"Extroversion":4,"Cleanliness":4,"Noise Tolerance":3,"Guest Tolerance":4,"Sleep Schedule":4,"Work Rhythm":4,"Social Needs":4,"Flexibility":5,"Sensitivity":2,"Caregiving":1,"Independence":3,"Teamwork":3,"Creativity":3,"Homebody":2,"Adaptability":4 }),
        photo_url: "/img/fomi/free-fomi.png"
      },
      {
        name: "Wanderer Fomi",
        traits: JSON.stringify({ "Introversion":2,"Extroversion":5,"Cleanliness":2,"Noise Tolerance":2,"Guest Tolerance":5,"Sleep Schedule":5,"Work Rhythm":4,"Social Needs":4,"Flexibility":5,"Sensitivity":2,"Caregiving":1,"Independence":1,"Teamwork":2,"Creativity":3,"Homebody":1,"Adaptability":4 }),
        photo_url: "/img/fomi/wanderer-fomi.png"
      },
      {
        name: "Noisy Fomi",
        traits: JSON.stringify({ "Introversion":2,"Extroversion":5,"Cleanliness":2,"Noise Tolerance":1,"Guest Tolerance":4,"Sleep Schedule":5,"Work Rhythm":4,"Social Needs":5,"Flexibility":2,"Sensitivity":2,"Caregiving":1,"Independence":1,"Teamwork":3,"Creativity":2,"Homebody":3,"Adaptability":3 }),
        photo_url: "/img/fomi/noisy-fomi.png"
      },
      {
        name: "Moderate Fomi",
        traits: JSON.stringify({ "Introversion":3,"Extroversion":3,"Cleanliness":3,"Noise Tolerance":3,"Guest Tolerance":3,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":3,"Flexibility":3,"Sensitivity":3,"Caregiving":2,"Independence":3,"Teamwork":3,"Creativity":3,"Homebody":3,"Adaptability":3 }),
        photo_url: "/img/fomi/moderate-fomi.png"
      },
      {
        name: "Sensitive Fomi",
        traits: JSON.stringify({ "Introversion":5,"Extroversion":1,"Cleanliness":4,"Noise Tolerance":5,"Guest Tolerance":1,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":2,"Flexibility":2,"Sensitivity":5,"Caregiving":2,"Independence":4,"Teamwork":1,"Creativity":3,"Homebody":4,"Adaptability":2 }),
        photo_url: "/img/fomi/sensitive-fomi.png"
      },
      {
        name: "Care Fomi",
        traits: JSON.stringify({ "Introversion":3,"Extroversion":4,"Cleanliness":5,"Noise Tolerance":3,"Guest Tolerance":4,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":4,"Flexibility":3,"Sensitivity":4,"Caregiving":5,"Independence":2,"Teamwork":4,"Creativity":2,"Homebody":4,"Adaptability":3 }),
        photo_url: "/img/fomi/care-fomi.png"
      },
      {
        name: "Homebody Fomi",
        traits: JSON.stringify({ "Introversion":5,"Extroversion":1,"Cleanliness":4,"Noise Tolerance":5,"Guest Tolerance":1,"Sleep Schedule":2,"Work Rhythm":2,"Social Needs":1,"Flexibility":2,"Sensitivity":3,"Caregiving":2,"Independence":4,"Teamwork":1,"Creativity":3,"Homebody":5,"Adaptability":2 }),
        photo_url: "/img/fomi/homebody-fomi.png"
      },
      {
        name: "Coexist Fomi",
        traits: JSON.stringify({ "Introversion":4,"Extroversion":2,"Cleanliness":4,"Noise Tolerance":4,"Guest Tolerance":3,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":3,"Flexibility":3,"Sensitivity":4,"Caregiving":3,"Independence":2,"Teamwork":3,"Creativity":3,"Homebody":4,"Adaptability":3 }),
        photo_url: "/img/fomi/coexist-fomi.png"
      },
      {
        name: "Balanced Fomi",
        traits: JSON.stringify({ "Introversion":3,"Extroversion":3,"Cleanliness":3,"Noise Tolerance":3,"Guest Tolerance":3,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":3,"Flexibility":3,"Sensitivity":3,"Caregiving":3,"Independence":3,"Teamwork":3,"Creativity":3,"Homebody":3,"Adaptability":3 }),
        photo_url: "/img/fomi/balanced-fomi.png"
      },
      {
        name: "Night Owl Fomi",
        traits: JSON.stringify({ "Introversion":4,"Extroversion":2,"Cleanliness":3,"Noise Tolerance":3,"Guest Tolerance":2,"Sleep Schedule":5,"Work Rhythm":2,"Social Needs":2,"Flexibility":3,"Sensitivity":4,"Caregiving":2,"Independence":3,"Teamwork":2,"Creativity":5,"Homebody":4,"Adaptability":2 }),
        photo_url: "/img/fomi/night-owl-fomi.png"
      },
      {
        name: "Independent Fomi",
        traits: JSON.stringify({ "Introversion":5,"Extroversion":1,"Cleanliness":4,"Noise Tolerance":5,"Guest Tolerance":1,"Sleep Schedule":3,"Work Rhythm":3,"Social Needs":1,"Flexibility":3,"Sensitivity":3,"Caregiving":1,"Independence":5,"Teamwork":1,"Creativity":2,"Homebody":4,"Adaptability":3 }),
        photo_url: "/img/fomi/independent-fomi.png"
      },
      {
        name: "Collab Fomi",
        traits: JSON.stringify({ "Introversion":2,"Extroversion":5,"Cleanliness":4,"Noise Tolerance":3,"Guest Tolerance":5,"Sleep Schedule":4,"Work Rhythm":4,"Social Needs":5,"Flexibility":3,"Sensitivity":3,"Caregiving":4,"Independence":2,"Teamwork":5,"Creativity":3,"Homebody":3,"Adaptability":4 }),
        photo_url: "/img/fomi/collab-fomi.png"
      },
      {
        name: "Adaptive Fomi",
        traits: JSON.stringify({ "Introversion":3,"Extroversion":4,"Cleanliness":3,"Noise Tolerance":3,"Guest Tolerance":4,"Sleep Schedule":3,"Work Rhythm":4,"Social Needs":3,"Flexibility":4,"Sensitivity":3,"Caregiving":3,"Independence":3,"Teamwork":4,"Creativity":3,"Homebody":4,"Adaptability":5 }),
        photo_url: "/img/fomi/adaptive-fomi.png"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fomis', null, {});
  }
};
