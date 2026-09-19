import express from "express";
import cors from "cors";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "lost found API is running 🚀" });
});

// Feature routes

export default app;
