import mongoose from 'mongoose';
import databaseConfig from '../config/database.config.js'; // default export

export const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseConfig.url); // no options needed
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('[ERROR] Database Connection Failed:', error.message);
    process.exit(1);
  }
};