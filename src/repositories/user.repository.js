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

  async findPaginatedUsers({ page = 1, limit = 10, search = '' }) {
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .populate({
        path: 'profile',
        select: 'personalInfo.firstName personalInfo.lastName',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return { users, total };
  }
}

module.exports = new UserRepository();
