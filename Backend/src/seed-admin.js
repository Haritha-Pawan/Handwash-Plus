import mongoose from 'mongoose';
import User from '../modules/users/user.model.js';
import { hashPassword } from '../@core/utils/jwt.utils.js';
import { config } from '../config/environment.config.js';
import { ROLES } from '../@core/constants/roles.constants.js';

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(config.database.url);
    console.log('Connected to MongoDB...');

    const existingAdmin = await User.findOne({ email: 'admin@cleanhands.com' });
    if (existingAdmin) {
      console.log('Super Admin already exists.');
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await hashPassword('admin123');
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@cleanhands.com',
      password: hashedPassword,
      role: ROLES.SUPER_ADMIN,
    });

    await superAdmin.save();
    console.log('✅ Super Admin created successfully!');
    console.log('Email: admin@cleanhands.com');
    console.log('Password: admin123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding Super Admin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
