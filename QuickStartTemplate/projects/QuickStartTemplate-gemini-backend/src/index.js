import express from "express";
import cors from "cors";
import { config } from "./utils/config.js";
import chatRoutes from "./routes/chat.js";
import corsMiddleware from "./middleware/cors.js";

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", chatRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Alvion Gemini Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      chat: "/api/chat",
      stream: "/api/chat/stream",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
  });
});

app.listen(config.port, () => {
  console.log(`🚀 Alvion Gemini Backend API listening on http://localhost:${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
  console.log(`💬 Chat API: http://localhost:${config.port}/api/chat`);
  console.log(`🌊 Stream API: http://localhost:${config.port}/api/chat/stream`);
});
