import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ Database connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    throw error;
  }
};

export default connectDB;