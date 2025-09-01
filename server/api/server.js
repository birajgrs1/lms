import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "../config/dbConnect.js";
import { clerkWebHooks, stripeWebHooks } from "../controllers/webhooks.js";
import educatorRouter from "../routes/educatorRoutes.js";
import courseRouter from "../routes/courseRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "../config/cloudinary.js";
import userRouter from "../routes/userRoutes.js";
import multer from "multer";

// Initialize dotenv
dotenv.config();

const app = express();

// Webhook endpoints first (before body parsing middleware)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebHooks);

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://lms-frontend-gray-kappa.vercel.app"] 
    : ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(clerkMiddleware());

// Service initialization
let servicesInitialized = false;
const initializeServices = async () => {
  if (servicesInitialized) return;
  
  try {
    await dbConnect();
    await connectCloudinary();
    console.log("✅ Services initialized");
    servicesInitialized = true;
  } catch (err) {
    console.error("❌ Service initialization failed:", err.message);
    throw err;
  }
};

app.use(async (req, res, next) => {
  try {
    await initializeServices();
    next();
  } catch (error) {
    console.error("Service initialization error:", error);
    res.status(503).json({
      success: false,
      message: "Service temporarily unavailable. Please try again."
    });
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is running...",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error stack:", error.stack);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${error.message}`,
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? "Internal server error" 
      : error.message,
  });
});

export default app;