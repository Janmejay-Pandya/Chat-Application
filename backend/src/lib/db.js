import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  
    if (!MONGODB_URI) {
        console.error("MONGODB_URI is undefined. Check your .env file or environment setup.");
        process.exit(1); // Exit process with failure
    }
    try {
      const connection = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};
