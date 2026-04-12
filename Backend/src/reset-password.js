import mongoose from 'mongoose';
import User from './modules/users/user.model.js';
import { config } from './config/environment.config.js';
import bcrypt from 'bcryptjs';

const resetPassword = async () => {
  try {
    await mongoose.connect(config.database.url);
    console.log('Connected to MongoDB...');

    const email = 'galleadmin@handwash.com';
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found.');
    } else {
      user.password = 'admin123';
      await user.save();
      console.log('Password reset to "admin123" for', email);
      
      const updatedUser = await User.findOne({ email }).select('+password');
      const isMatch = await bcrypt.compare('admin123', updatedUser.password);
      console.log('Verification match:', isMatch);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

resetPassword();
