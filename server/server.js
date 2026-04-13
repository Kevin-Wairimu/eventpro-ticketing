import dotenv from "dotenv";
// Load environment variables immediately
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http"; // Required for Socket.IO
import { Server } from "socket.io"; // Required for Socket.IO
import sequelize from "./config/database.js"; // Import Sequelize instance

// Import all your route files
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

// Import models to ensure they are registered with Sequelize
import "./models/User.js";
import "./models/Event.js";
import "./models/Ticket.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Health check route
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

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
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);

// Export the app for Vercel serverless function (must be exported as default)
export default app;

// --- Socket.IO Connection Logic ---
io.on("connection", (socket) => {
  console.log(`[Socket.IO]  A user connected: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`[Socket.IO] 🤝 User ${socket.id} joined room: "${room}"`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.IO]  A user disconnected: ${socket.id}`);
  });
});

// Connect to Database and start server only if NOT in Vercel environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const startServer = async () => {
    try {
      // Authenticate database connection
      await sequelize.authenticate();
      console.log("Supabase PostgreSQL connected via Sequelize");

      // Sync models (use alter: true for development)
      await sequelize.sync({ alter: true });
      console.log("Database synchronized");

      // Start the server
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      // Let it crash locally for debugging
    }
  };

  startServer();
}

