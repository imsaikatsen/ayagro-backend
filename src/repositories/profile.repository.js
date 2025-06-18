const Profile = require('../models/profile.model');

class ProfileRepository {
  async create(profileData) {
    return await Profile.create(profileData);
  }

  async findByUserId(userId) {
    return await Profile.findOne({ user_id: userId });
  }

  async updateByUserId(userId, updateData) {
    return await Profile.findOneAndUpdate({ user_id: userId }, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async findAll() {
    return await Profile.find().populate('user_id', 'email phone role');
  }
}

module.exports = new ProfileRepository();
