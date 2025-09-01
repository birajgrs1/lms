import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  try {
    // Close any existing connection to prevent connection leaks
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    throw error;
  }
};

// Handle graceful shutdown for serverless environments
process.on('SIGTERM', async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Database connection closed due to app termination');
  }
  process.exit(0);
});

export default connectDB;