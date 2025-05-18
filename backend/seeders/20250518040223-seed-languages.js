"use strict";

module.exports = {
  up: async (queryInterface) => {
    const languages = [
      "Afrikaans", "Arabic", "Bengali", "Cantonese", "Dutch", "English", "French", "German",
      "Hindi", "Indonesian", "Italian", "Japanese", "Kannada", "Korean", "Malay", "Mandarin Chinese",
      "Marathi", "Persian", "Polish", "Portuguese", "Punjabi", "Russian", "Spanish", "Swahili",
      "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Other"
    ].map(name => ({ name }));

    await queryInterface.bulkInsert("languages", languages);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("languages", null, {});
  }
};
