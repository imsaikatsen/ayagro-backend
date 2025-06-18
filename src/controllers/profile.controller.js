const profileService = require('../services/profile.service');

class ProfileController {
  async createOrUpdateProfile(req, res, next) {
    try {
      const userId = req.user.id; // from token middleware
      const profileData = req.body;
      const profile = await profileService.createOrUpdateProfile(
        userId,
        profileData
      );
      res
        .status(200)
        .json({ message: 'Profile saved successfully', data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getMyProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await profileService.getProfileByUserId(userId);
      res.status(200).json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getAllProfiles(req, res, next) {
    try {
      const profiles = await profileService.getAllProfiles();
      res.status(200).json({ data: profiles });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
