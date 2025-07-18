const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.userRepository.create(userData);
    const token = this.generateToken(user._id);
    
    return {
      user: { id: user._id, email: user.email, name: user.name },
      token
    };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);
    return {
      user: { id: user._id, email: user.email, name: user.name },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}

module.exports = AuthUseCase;