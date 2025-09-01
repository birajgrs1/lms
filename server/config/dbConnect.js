// config/dbConnect.js
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
  }
};

export default connectDB;


// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Database connected Successfully ...");
//     } catch (error) {
//         console.log(error);
//     }
// };

// export default connectDB;