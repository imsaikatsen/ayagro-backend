const User = require('../models/user.model');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async findByUsername(username) {
    return await User.findOne({ username });
  }

  async findByPhone(phone) {
    return await User.findOne({ phone });
  }

  async findByNID(nid) {
    return await User.findOne({ nid });
  }

  async findAll() {
    return await User.find().select('-password').populate({
      path: 'profile',
      select: 'personalInfo.firstName personalInfo.lastName',
    });
  }

  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    }).select('-password');
  }

  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async findByEmailOrPhone(identifier) {
    return await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
  }
}

module.exports = new UserRepository();
