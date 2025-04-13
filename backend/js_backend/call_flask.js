require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const db = require('../models');

(async () => {
    try {
      // Fetch all users (you can add filters if needed)
      const users = await db.User.findAll({
        attributes: ['name', 'bio', 'age', 'gender'],
      });
  
      // Convert to matching AI format
      const profiles = {};
      users.forEach(user => {
        // Build profile description
        const descriptionParts = [
          user.bio || "",                         // bio
          `Age: ${user.age || 'N/A'}`,            // age
          `Gender: ${user.gender || 'N/A'}`       // gender
        ];
  
        profiles[user.name] = descriptionParts.join(". ");
      });
  
      // Send to Flask API
      const response = await axios.post('http://localhost:5001/match_profiles', { profiles });
  
      console.log("Matching Results:");
      console.log(response.data);
      
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      await db.sequelize.close();
    }
  })();