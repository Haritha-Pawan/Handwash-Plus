import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './src/modules/users/user.model.js';
import { generateToken } from './src/@core/utils/jwt.utils.js';
import { config } from './src/config/environment.config.js';

dotenv.config();

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ email: 'sadeepa@gmail.com' }).populate('school');
    
    if (!user) {
      console.log('No suitable test user found.');
      process.exit(1);
    }

    // Simulate standard token generation (now using 'id')
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      ...(user.role !== 'superAdmin' && user.school && { 
        school: user.school._id || user.school, 
        schoolName: user.school.name 
      })
    };
    
    const { accessToken } = generateToken(payload);
    console.log('Token generated with payload id:', payload.id);

    // Simulate Middleware
    const decoded = jwt.verify(accessToken, config.jwt.secret);
    console.log('Decoded token ID:', decoded.id);

    if (decoded.id && decoded.id.toString() === user._id.toString()) {
      console.log('SUCCESS: Token correctly contains "id" field.');
    } else {
      console.log('FAILED: Token missing or incorrect "id" field.');
    }

  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    process.exit(0);
  }
}

verify();
