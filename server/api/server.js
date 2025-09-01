import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/dbConnect.js";
import { clerkWebHooks, stripeWebHooks } from "../controllers/webhooks.js";
import educatorRouter from "../routes/educatorRoutes.js";
import courseRouter from "../routes/courseRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "../config/cloudinary.js";
import userRouter from "../routes/userRoutes.js";
import multer from "multer";

dotenv.config();
const app = express();

// Initialize services once
let servicesInitialized = false;
const initializeServices = async () => {
  if (servicesInitialized) return;
  
  try {
    await connectDB();
    await connectCloudinary();
    console.log("✅ Services initialized");
    servicesInitialized = true;
  } catch (err) {
    console.error("❌ Service initialization failed:", err.message);
    throw err;
  }
};

// Add error handling for the initialization middleware
app.use(async (req, res, next) => {
  try {
    await initializeServices();
    next();
  } catch (error) {
    console.error("Service initialization error:", error);
    res.status(500).json({
      success: false,
      message: "Service initialization failed. Please try again later."
    });
  }
});


// Webhook handlers (must come before other middleware)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://lms-frontend-gray-kappa.vercel.app"] 
    : ["http://localhost:5173"],
  credentials: true
}));

app.use(clerkMiddleware());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize services on first request in development
if (process.env.NODE_ENV !== 'production') {
  app.use(async (req, res, next) => {
    try {
      await initializeServices();
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Service initialization failed"
      });
    }
  });
}

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      message: error.message 
    });
  }
});

app.post("/clerk", clerkWebHooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
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
    message: error.message || "Internal server error",
  });
});

// Export for Vercel serverless functions
export default app;