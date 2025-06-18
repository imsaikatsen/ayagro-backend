const profileRepository = require('../repositories/profile.repository');
const ApiError = require('../utils/apiError');

class ProfileService {
  async createOrUpdateProfile(userId, profileData) {
    const existingProfile = await profileRepository.findByUserId(userId);

    if (existingProfile) {
      return await profileRepository.updateByUserId(userId, profileData);
    }

    return await profileRepository.create({ user_id: userId, ...profileData });
  }

  async getProfileByUserId(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }
    return profile;
  }

  async getAllProfiles() {
    return await profileRepository.findAll();
  }
}

module.exports = new ProfileService();
