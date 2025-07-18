const UserRepository = require('../repositories/UserRepository');

class UserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      bankDetails: user.bankDetails
    };
  }

  async addBankDetails(userId, bankDetails) {
    const user = await this.userRepository.updateBankDetails(userId, bankDetails);
    if (!user) {
      throw new Error('User not found');
    }
    return user.bankDetails;
  }

  async updateBankDetail(userId, bankDetailId, updateData) {
    const user = await this.userRepository.updateBankDetail(userId, bankDetailId, updateData);
    if (!user) {
      throw new Error('User or bank detail not found');
    }
    return user.bankDetails;
  }

  async deleteBankDetail(userId, bankDetailId) {
    const user = await this.userRepository.deleteBankDetail(userId, bankDetailId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.bankDetails;
  }
}

module.exports = UserUseCase;