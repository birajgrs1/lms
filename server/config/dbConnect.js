import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Using existing database connection");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;