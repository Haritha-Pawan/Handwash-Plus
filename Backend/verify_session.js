import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './src/modules/users/user.model.js';
import School from './src/modules/schools/school.model.js';
import { generateToken } from './src/@core/utils/jwt.utils.js';
import { config } from './src/config/environment.config.js';

dotenv.config();

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Find the specific test user we updated
    const user = await User.findOne({ email: 'sadeepa@gmail.com' }).populate('school');
    
    if (!user) {
      console.log('No suitable test user found. Please ensure you have a teacher/admin with a school assigned.');
      process.exit(1);
    }

    console.log(`Testing with user: ${user.email}, Role: ${user.role}, School: ${user.school?.name}`);

    // Simulate AuthService token generation
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      ...(user.role !== 'superAdmin' && user.school && { 
        school: user.school._id || user.school, 
        schoolName: user.school.name 
      })
    };
    
    const { accessToken } = generateToken(payload);
    console.log('Token generated successfully');

    // Simulate Middleware logic
    const decoded = jwt.verify(accessToken, config.jwt.secret);
    const req = { user: decoded };

    // Middleware fallback/check logic
    if (decoded.role !== "superAdmin" && !req.user.school) {
       // Should not happen if token generation is correct
       console.log('Warning: School missing from token payload');
    }

    if (req.user.school && typeof req.user.school === 'object') {
       req.user.school = req.user.school.toString();
    }

    console.log('Resulting req.user.school:', req.user.school);
    console.log('Type of req.user.school:', typeof req.user.school);

    if (typeof req.user.school === 'string' && req.user.school.length === 24) {
      console.log('SUCCESS: School ID is a valid hex string.');
    } else {
      console.log('FAILED: School ID is not in the expected format.');
    }

    // Test Super Admin (No school should be attached)
    const admin = await User.findOne({ role: 'superAdmin' });
    if (admin) {
        const adminPayload = {
            userId: admin._id,
            email: admin.email,
            role: admin.role,
            ...(admin.role !== 'superAdmin' && admin.school && { 
                school: admin.school._id || admin.school, 
                schoolName: admin.school.name 
            })
        };
        console.log('Super Admin Token Payload School:', adminPayload.school);
        if (!adminPayload.school) {
            console.log('SUCCESS: Super Admin has no school attached.');
        } else {
            console.log('FAILED: Super Admin has school attached.');
        }
    }

  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    process.exit(0);
  }
}

verify();
