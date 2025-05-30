'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('fomi_relations', [
      // Quiet Fomi
      { source_fomi: "Quiet Fomi",      target_fomi: "Independent Fomi", relation_type: "best"  },
      { source_fomi: "Quiet Fomi",      target_fomi: "Energy Fomi",      relation_type: "worst" },
      // Energy Fomi
      { source_fomi: "Energy Fomi",     target_fomi: "Noisy Fomi",       relation_type: "best"  },
      { source_fomi: "Energy Fomi",     target_fomi: "Homebody Fomi",    relation_type: "worst" },
      // Emotional Fomi
      { source_fomi: "Emotional Fomi",  target_fomi: "Coexist Fomi",     relation_type: "best"  },
      { source_fomi: "Emotional Fomi",  target_fomi: "Energy Fomi",      relation_type: "worst" },
      // Free Fomi
      { source_fomi: "Free Fomi",       target_fomi: "Moderate Fomi",    relation_type: "best"  },
      { source_fomi: "Free Fomi",       target_fomi: "Homebody Fomi",    relation_type: "worst" },
      // Wanderer Fomi
      { source_fomi: "Wanderer Fomi",   target_fomi: "Energy Fomi",      relation_type: "best"  },
      { source_fomi: "Wanderer Fomi",   target_fomi: "Homebody Fomi",    relation_type: "worst" },
      // Noisy Fomi
      { source_fomi: "Noisy Fomi",      target_fomi: "Energy Fomi",      relation_type: "best"  },
      { source_fomi: "Noisy Fomi",      target_fomi: "Sensitive Fomi",   relation_type: "worst" },
      // Moderate Fomi
      { source_fomi: "Moderate Fomi",   target_fomi: "Balanced Fomi",    relation_type: "best"  },
      { source_fomi: "Moderate Fomi",   target_fomi: "Wanderer Fomi",    relation_type: "worst" },
      // Sensitive Fomi
      { source_fomi: "Sensitive Fomi",  target_fomi: "Quiet Fomi",       relation_type: "best"  },
      { source_fomi: "Sensitive Fomi",  target_fomi: "Free Fomi",        relation_type: "worst" },
      // Care Fomi
      { source_fomi: "Care Fomi",       target_fomi: "Homebody Fomi",    relation_type: "best"  },
      { source_fomi: "Care Fomi",       target_fomi: "Night Owl Fomi",   relation_type: "worst" },
      // Homebody Fomi
      { source_fomi: "Homebody Fomi",   target_fomi: "Care Fomi",        relation_type: "best"  },
      { source_fomi: "Homebody Fomi",   target_fomi: "Energy Fomi",      relation_type: "worst" },
      // Coexist Fomi
      { source_fomi: "Coexist Fomi",    target_fomi: "Emotional Fomi",   relation_type: "best"  },
      { source_fomi: "Coexist Fomi",    target_fomi: "Night Owl Fomi",   relation_type: "worst" },
      // Balanced Fomi
      { source_fomi: "Balanced Fomi",   target_fomi: "Moderate Fomi",    relation_type: "best"  },
      { source_fomi: "Balanced Fomi",   target_fomi: "Wanderer Fomi",    relation_type: "worst" },
      // Night Owl Fomi
      { source_fomi: "Night Owl Fomi",  target_fomi: "Adaptive Fomi",    relation_type: "best"  },
      { source_fomi: "Night Owl Fomi",  target_fomi: "Wanderer Fomi",    relation_type: "worst" },
      // Independent Fomi
      { source_fomi: "Independent Fomi",target_fomi: "Quiet Fomi",       relation_type: "best"  },
      { source_fomi: "Independent Fomi",target_fomi: "Noisy Fomi",       relation_type: "worst" },
      // Collab Fomi
      { source_fomi: "Collab Fomi",     target_fomi: "Energy Fomi",      relation_type: "best"  },
      { source_fomi: "Collab Fomi",     target_fomi: "Quiet Fomi",       relation_type: "worst" },
      // Adaptive Fomi
      { source_fomi: "Adaptive Fomi",   target_fomi: "Night Owl Fomi",   relation_type: "best"  },
      { source_fomi: "Adaptive Fomi",   target_fomi: "Wanderer Fomi",    relation_type: "worst" }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fomi_relations', null, {});
  }
};
