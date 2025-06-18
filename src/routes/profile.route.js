const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Only authenticated users can access
router.post(
  '/',
  authMiddleware.authenticate,
  profileController.createOrUpdateProfile
);
router.get('/me', authMiddleware.authenticate, profileController.getMyProfile);

// Optionally restrict to admin
router.get(
  '/all-profile',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  profileController.getAllProfiles
);

module.exports = router;
