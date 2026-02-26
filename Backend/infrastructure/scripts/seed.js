import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../../src/modules/users/user.model.js';
import { databaseConfig } from '../../src/config/database.config.js';

dotenv.config();

// Super Admin permissions (full access)
const SUPER_ADMIN_PERMISSIONS = [
  'create:school', 'read:school', 'update:school', 'delete:school',
  'create:user', 'read:user', 'update:user', 'delete:user',
  'create:dispenser', 'read:dispenser', 'update:dispenser', 'delete:dispenser',
  'manage:inventory', 'view:reports', 'manage:notifications'
];

// Super Admin details
const superAdminData = {
  name: "System Super Administrator",
  email: "superadmin@gmail.com",
  password: "pawan123", // This should be changed after first login
  role: "superAdmin",
  permissions: SUPER_ADMIN_PERMISSIONS,
  isEmailVerified: true,
  isPhoneVerified: true,
  status: "ACTIVE",
  phone: "+94771234567",
  address: {
    street: "123 Main Street",
    city: "Colombo",
    district: "Colombo",
    postalCode: "00100"
  },
  // Super admin doesn't need school info
  schoolRegNo: null,
  schoolName: null,
  class: null,
  // Metadata
  createdBy: null, // Self-created
  updatedBy: null
};



const createSuperAdmin = async () => {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(databaseConfig.uri);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ 
      $or: [
        { email: superAdminData.email },
        { role: 'superAdmin' }
      ]
    });

    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists:');
      console.log(`   Name: ${existingSuperAdmin.name}`);
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Role: ${existingSuperAdmin.role}`);
      
      // Update existing super admin if needed
      const shouldUpdate = process.env.UPDATE_SUPER_ADMIN === 'true';
      
      if (shouldUpdate) {
        // Update permissions and status
        existingSuperAdmin.permissions = SUPER_ADMIN_PERMISSIONS;
        existingSuperAdmin.status = 'ACTIVE';
        existingSuperAdmin.updatedAt = new Date();
        
        await existingSuperAdmin.save();
        console.log('✅ Super admin updated successfully');
      }
      
      await mongoose.disconnect();
      return existingSuperAdmin;
    }

    // Create new super admin
    console.log('👤 Creating new super admin...');
    
    const superAdmin = new User(superAdminData);
    await superAdmin.save();
    
    console.log('\n✅ Super admin created successfully!');
    console.log('\n📋 Super Admin Details:');
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role: ${superAdmin.role}`);
    console.log(`   Permissions: ${superAdmin.permissions.length} permissions granted`);
    console.log(`   Status: ${superAdmin.status}`);
    console.log(`   ID: ${superAdmin._id}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Password: ${superAdminData.password}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    await mongoose.disconnect();
    return superAdmin;

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Create super admin with custom data
const createCustomSuperAdmin = async (customData) => {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(databaseConfig.uri);
    console.log('✅ Connected to MongoDB');

    // Check if email already exists
    const existingUser = await User.findOne({ email: customData.email });
    
    if (existingUser) {
      console.log(`⚠️  User with email ${customData.email} already exists`);
      await mongoose.disconnect();
      return null;
    }

    // Ensure super admin permissions
    const userData = {
      ...customData,
      role: 'superAdmin',
      permissions: SUPER_ADMIN_PERMISSIONS,
      isEmailVerified: true,
      status: 'ACTIVE'
    };

    const superAdmin = new User(userData);
    await superAdmin.save();

    console.log('✅ Custom super admin created successfully!');
    console.log(`   Email: ${superAdmin.email}`);
    
    await mongoose.disconnect();
    return superAdmin;

  } catch (error) {
    console.error('❌ Error creating custom super admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// List all super admins
const listSuperAdmins = async () => {
  try {
    await mongoose.connect(databaseConfig.uri);
    
    const superAdmins = await User.find({ role: 'superAdmin' })
      .select('name email status createdAt lastLogin')
      .sort('-createdAt');

    console.log('\n📋 Super Admin List:');
    if (superAdmins.length === 0) {
      console.log('   No super admins found');
    } else {
      superAdmins.forEach((admin, index) => {
        console.log(`\n   ${index + 1}. ${admin.name}`);
        console.log(`      Email: ${admin.email}`);
        console.log(`      Status: ${admin.status}`);
        console.log(`      Created: ${admin.createdAt.toLocaleDateString()}`);
        console.log(`      Last Login: ${admin.lastLogin ? admin.lastLogin.toLocaleDateString() : 'Never'}`);
      });
    }

    await mongoose.disconnect();
    return superAdmins;

  } catch (error) {
    console.error('❌ Error listing super admins:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Delete super admin (use with caution!)
const deleteSuperAdmin = async (email) => {
  try {
    await mongoose.connect(databaseConfig.uri);
    
    const result = await User.deleteOne({ 
      email: email,
      role: 'superAdmin' 
    });

    if (result.deletedCount > 0) {
      console.log(`✅ Super admin ${email} deleted successfully`);
    } else {
      console.log(`⚠️  Super admin ${email} not found`);
    }

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Error deleting super admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Main function to run
const main = async () => {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      await createSuperAdmin();
      break;
      
    case 'list':
      await listSuperAdmins();
      break;
      
    case 'delete':
      const email = process.argv[3];
      if (!email) {
        console.log('Please provide email to delete');
        process.exit(1);
      }
      await deleteSuperAdmin(email);
      break;
      
    case 'custom':
      // Example: node create-super-admin.js custom "John Doe" "john@example.com" "Pass@123"
      const name = process.argv[3];
      const customEmail = process.argv[4];
      const password = process.argv[5];
      
      if (!name || !customEmail || !password) {
        console.log('Usage: node create-super-admin.js custom "Name" "email@example.com" "password"');
        process.exit(1);
      }
      
      await createCustomSuperAdmin({
        name,
        email: customEmail,
        password,
        phone: process.argv[6] || null
      });
      break;
      
    default:
      // Default: create super admin
      await createSuperAdmin();
  }
  
  process.exit(0);
};

// Run the script
main();