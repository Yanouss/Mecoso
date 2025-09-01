const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');

// Load environment variables
dotenv.config();

const createInitialAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create initial admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@mecoso.com', // Change this to your desired admin email
      password: 'admin123456', // Change this to a secure password
      role: 'admin',
      isActive: true
    });

    console.log('Initial admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123456'); // Remember to change this
    console.log('Role:', adminUser.role);
    console.log('\n⚠️  IMPORTANT: Please change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the setup
createInitialAdmin();