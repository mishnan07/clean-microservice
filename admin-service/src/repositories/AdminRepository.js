const Admin = require('../entities/Admin');

class AdminRepository {
  async create(adminData) {
    const admin = new Admin(adminData);
    return await admin.save();
  }

  async findByEmail(email) {
    return await Admin.findOne({ email });
  }

  async findById(id) {
    return await Admin.findById(id);
  }
}

module.exports = AdminRepository;