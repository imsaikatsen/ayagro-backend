const User = require('../models/user.model');
const profileRepository = require('../repositories/profile.repository');
const ApiError = require('../utils/apiError');

class ProfileService {
  // async createOrUpdateProfile(userId, profileData) {
  //   const existingProfile = await profileRepository.findByUserId(userId);

  //   if (existingProfile) {
  //     return await profileRepository.updateByUserId(userId, profileData);
  //   }

  //   return await profileRepository.create({ user_id: userId, ...profileData });
  // }

  async createOrUpdateProfile(userId, profileData) {
    // ✅ 1. Fetch the logged-in user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // ✅ 2. Ensure personalInfo exists
    if (!profileData.personalInfo) {
      profileData.personalInfo = {};
    }

    // ✅ 3. Inject phone from user if not provided in form
    if (!profileData.personalInfo.phone) {
      profileData.personalInfo.phone = user.phone;
    }

    // 🔒 Optional: Always enforce login phone
    // delete profileData.personalInfo.phone;
    // profileData.personalInfo.phone = user.phone;

    // ✅ 4. Check if profile exists
    const existingProfile = await profileRepository.findByUserId(userId);

    if (existingProfile) {
      // ✅ 5. Update existing profile
      return await profileRepository.updateByUserId(userId, profileData);
    }

    // ✅ 6. Create new profile
    return await profileRepository.create({
      user_id: userId,
      ...profileData,
    });
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
