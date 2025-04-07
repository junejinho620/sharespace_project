const { Sequelize } = require("sequelize"); // Import Sequelize ORM
require("dotenv").config(); // Load environment variables

// Create a Sequelize instance (database connection)
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST, // Database host (localhost or cloud)
  dialect: "mysql", // Specify MySQL as the database type
  logging: false, // Disable logging (optional)
});

module.exports = db; // Export database connection