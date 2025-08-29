import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB() {
  const connection = await mongoose.connect(process.env.MONGO_DB_URL);
  console.log(`MongoDB database name: ${connection.connection.name}`);
}

export default connectDB;
