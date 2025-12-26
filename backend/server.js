// Import required modules
const express = require("express"); // Web framework for handling HTTP requests
const http = require("http");
const { Server } = require("socket.io"); // Allow real-time messaging
const cors = require("cors"); // Middleware to allow cross-origin requests
const dotenv = require("dotenv"); // Loads environment variables from .env file
const morgan = require("morgan"); // Logs HTTP requests for debugging
const { sequelize } = require('./models');
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Passport setup
const passport = require("passport");
require("./config/passport");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow from everywhere for now
    methods: ["GET", "POST"],
  },
});

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(morgan("dev")); // Log incoming HTTP requests
app.use(express.json()); // Parse JSON request bodies
app.use(passport.initialize()); // Initialize passport after body-parsing
app.use(express.static(path.join(__dirname, "..", "frontend"))); // Serve HTML/CSS/JS
app.use(express.static(path.join(__dirname, "..", "public"))); // Serve public files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Upload files statically

// Define routes
const userRoutes = require("./routes/userRoutes");
const roommatePrefRoutes = require("./routes/roommatePrefRoutes");
const recommendRoutes = require("./routes/recommendRoutes");
const messageRoutes = require("./routes/messageRoutes");
const likeRoutes = require("./routes/likeRoutes");
const hobbyRoutes = require("./routes/hobbyRoutes");
const languageRoutes = require("./routes/languageRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const fomiRoutes = require("./routes/fomiRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/users", userRoutes);
app.use("/api/users/auth", authRoutes);
app.use("/api/prefs", roommatePrefRoutes);
app.use("/api/recommendations", recommendRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/hobbies", hobbyRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api", fomiRoutes);

// Connect to MySQL database
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.log("❌ Error: " + err));

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New WebSocket connection:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("private_message", ({ receiverId, message }) => {
    console.log(`Private message for receiverId: ${receiverId}`, message);

    if (receiverId === message.sender_id) {
      // Self-chat: only emit once
      io.to(receiverId).emit("new_message", message);
    } else {
      // Normal chat: emit to both sender and receiver
      io.to(receiverId).emit("new_message", message);
      io.to(message.sender_id).emit("new_message", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "../frontend/404-error.html"));
}); //Automatically serve the 404-error.html page for broken API routes or frontend links
