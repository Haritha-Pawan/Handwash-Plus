import mongoose from 'mongoose';
import User from './modules/users/user.model.js';
import School from './modules/schools/school.model.js'; // Ensure School model is registered
import { config } from './config/environment.config.js';
import bcrypt from 'bcryptjs';

const checkUser = async () => {
  try {
    await mongoose.connect(config.database.url);
    console.log('Connected to MongoDB...');

    const email = 'galleadmin@handwash.com';
    const user = await User.findOne({ email }).populate('school');
    if (!user) {
      console.log('User not found.');
    } else {
      console.log('User found:', {
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school ? user.school.name : 'No school',
        password: user.password ? 'Hash exists' : 'No password',
        isBlocked: user.isBlocked
      });
      
      const isMatch = await bcrypt.compare('admin123', user.password);
      console.log('Password "admin123" match:', isMatch);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUser();
