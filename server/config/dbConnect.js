import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { dbName: "lms-sys" })
      .then((conn) => {
        console.log(`✅ Database connected: ${conn.connection.host}`);
        return conn;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
