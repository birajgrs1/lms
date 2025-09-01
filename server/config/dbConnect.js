import mongoose from "mongoose";

let isConnected = false; // Cached connection for serverless

const connectDB = async () => {
  if (isConnected) return;

  try {
    if (mongoose.connection.readyState !== 1) {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        dbName: "lms-sys",
      });
      console.log(`✅ Database connected: ${conn.connection.host}`);
    }
    isConnected = true;
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
