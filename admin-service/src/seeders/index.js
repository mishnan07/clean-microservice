require('dotenv').config();
const connectDB = require('../config/database');
const AdminRepository = require('../repositories/AdminRepository');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const adminRepository = new AdminRepository();
    
    // Check if admin already exists
    const existingAdmin = await adminRepository.findByEmail('admin@example.com');
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create initial admin
    const adminData = {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'System Administrator'
    };

    const admin = await adminRepository.create(adminData);
    console.log('Admin created successfully:', {
      id: admin._id,
      email: admin.email,
      name: admin.name
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();