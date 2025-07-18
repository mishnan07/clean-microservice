const jwt = require('jsonwebtoken');
const AdminRepository = require('../repositories/AdminRepository');

class AdminAuthUseCase {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async register(adminData) {
    const existingAdmin = await this.adminRepository.findByEmail(adminData.email);
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }

    const admin = await this.adminRepository.create(adminData);
    const token = this.generateToken(admin._id);
    
    return {
      admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      token
    };
  }

  async login(email, password) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin || !(await admin.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(admin._id);
    return {
      admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      token
    };
  }

  generateToken(adminId) {
    return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}

module.exports = AdminAuthUseCase;