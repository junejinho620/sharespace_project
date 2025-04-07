// Import required modules
const express = require("express"); // Web framework for handling HTTP requests
const cors = require("cors"); // Middleware to allow cross-origin requests
const dotenv = require("dotenv"); // Loads environment variables from .env file
const bodyParser = require("body-parser"); // Parses incoming JSON data
const morgan = require("morgan"); // Logs HTTP requests for debugging

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(morgan("dev")); // Log incoming HTTP requests

// Import database and routes
const { db } = require('./models');

db.sync({ alter: true }) // You can use { force: true } to drop and recreate tables
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Error creating database tables:', err));
const userRoutes = require("./routes/userRoutes"); // Import user-related routes

// Connect to MySQL database
db.authenticate()
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.log("❌ Error: " + err));

// Define routes
app.use("/api/users", userRoutes); // Routes for user authentication

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));