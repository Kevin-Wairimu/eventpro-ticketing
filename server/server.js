import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http"; // Required for Socket.IO
import { Server } from "socket.io"; // Required for Socket.IO

// Import all your route files
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Create the HTTP server and the Socket.IO server ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware to attach 'io' to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Standard Middleware
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json()); // Modern replacement for bodyParser.json()

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log(`[Socket.IO] ✅ A user connected: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    // --- LOG #1: Confirm that the user is joining the correct room ---
    console.log(`[Socket.IO] 🤝 User ${socket.id} joined room: "${room}"`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] ❌ A user disconnected: ${socket.id}`);
  });
});
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventoria", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// --- THIS IS THE CRITICAL FIX ---
// REMOVED the extra 'app.listen()' that was causing the crash.
// We are ONLY starting the 'server' (the one with Socket.IO).
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
