import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "../config/dbConnect.js";
import connectCloudinary from "../config/cloudinary.js";
import educatorRouter from "../routes/educatorRoutes.js";
import courseRouter from "../routes/courseRoutes.js";
import userRouter from "../routes/userRoutes.js";
import { clerkWebHooks, stripeWebHooks } from "../controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import multer from "multer";

dotenv.config();

const app = express();

// Webhooks (before body parsing)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebHooks);

// Middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://lms-frontend-gray-kappa.vercel.app"]
        : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(clerkMiddleware());

// Initialize services once (cold-start safe)
let isDBConnected = false;

const initializeServicesOnce = async () => {
  // Connect DB if not connected
  if (!isDBConnected) {
    await dbConnect();
    isDBConnected = true;
  }
  // Cloudinary config (instant, no await needed)
  connectCloudinary();
};

// Run initialization at cold start
initializeServicesOnce().catch((err) => console.error("Initialization failed:", err));

// Middleware to ensure DB is connected (non-blocking)
app.use(async (req, res, next) => {
  if (!isDBConnected) {
    try {
      await dbConnect();
      isDBConnected = true;
    } catch (err) {
      return res
        .status(503)
        .json({ success: false, message: "Service temporarily unavailable" });
    }
  }
  next();
});

// Routes
app.get("/", (req, res) =>
  res.json({ success: true, message: "Server is running", timestamp: new Date() })
);

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() })
);

// Error handling
app.use((error, req, res, next) => {
  console.error(error.stack);
  if (error instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ success: false, message: `File upload error: ${error.message}` });
  }
  res
    .status(500)
    .json({
      success: false,
      message:
        process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
});

export default serverless(app);
