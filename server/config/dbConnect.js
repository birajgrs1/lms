import mongoose from "mongoose";

const  connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log(" Using existing database connection");
      return;
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" DB connection error:", error.message);
    throw error;
  }
};

export default connectDB;