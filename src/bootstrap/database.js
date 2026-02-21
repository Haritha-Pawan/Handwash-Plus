import mongoose from 'mongoose';
import config from '../config/index.js';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.url);
    console.log(' MongoDB Connected Successfully');
  } catch (error) {
    console.error(' Database Connection Failed:', error.message);
    process.exit(1);
  }
};