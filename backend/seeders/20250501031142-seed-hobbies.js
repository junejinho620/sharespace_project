"use strict";

module.exports = {
  up: async (queryInterface) => {
    const hobbies = [
      { name: "Gaming", icon: "🎮", category: "Entertainment" },
      { name: "Watching Movies", icon: "🎬", category: "Entertainment" },
      { name: "Board Games", icon: "♟️", category: "Entertainment" },
      { name: "Anime", icon: "🧝", category: "Entertainment" },
      { name: "Podcasts", icon: "🎧", category: "Entertainment" },
      { name: "Working Out", icon: "🏋️", category: "Health" },
      { name: "Yoga", icon: "🧘", category: "Health" },
      { name: "Meditation", icon: "🧘‍♂️", category: "Health" },
      { name: "Hiking", icon: "🥾", category: "Health" },
      { name: "Running", icon: "🏃", category: "Health" },
      { name: "Biking", icon: "🚴", category: "Health" },
      { name: "Cooking", icon: "🍳", category: "Food" },
      { name: "Baking", icon: "🧁", category: "Food" },
      { name: "Coffee Brewing", icon: "☕", category: "Food" },
      { name: "Thrifting", icon: "🛍️", category: "Lifestyle" },
      { name: "Drawing", icon: "✏️", category: "Creative" },
      { name: "Photography", icon: "📸", category: "Creative" },
      { name: "Traveling", icon: "✈️", category: "Culture" },
      { name: "Reading", icon: "📚", category: "Learning" },
      { name: "Language Learning", icon: "🈳", category: "Culture" },
    ];

    await queryInterface.bulkInsert("hobbies", hobbies);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("hobbies", null, {});
  },
};
