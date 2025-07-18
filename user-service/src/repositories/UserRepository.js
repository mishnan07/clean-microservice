const User = require('../entities/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async updateBankDetails(userId, bankDetails) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { bankDetails } },
      { new: true }
    );
  }

  async deleteBankDetail(userId, bankDetailId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { bankDetails: { _id: bankDetailId } } },
      { new: true }
    );
  }

  async updateBankDetail(userId, bankDetailId, updateData) {
    return await User.findOneAndUpdate(
      { _id: userId, 'bankDetails._id': bankDetailId },
      { $set: { 'bankDetails.$': { ...updateData, _id: bankDetailId } } },
      { new: true }
    );
  }
}

module.exports = UserRepository;