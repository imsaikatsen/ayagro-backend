const express = require('express');
const authController = require('../controllers/auth.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const { registerSchema } = require('../validations/auth.validation');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

//...... ADMIN ..........//

router.post('/register', validate(registerSchema), authController.register);
router.post('/admin-login', authController.adminLogin); // Admin login by email/phone

router.get(
  '/admin/me',
  authMiddleware.authenticate,
  authController.getCurrentAdmin
);

//...... USER ..........//

router.get(
  '/users',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('super_admin'),
  authController.getUserList
);

router.put(
  '/users/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('super_admin'),
  authController.updateUser
);

router.delete(
  '/users/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('super_admin'),
  authController.deleteUser
);

router.post('/request-otp', authController.requestOtp); // Customer OTP request
router.post('/verify-otp', authController.verifyOtp); // Customer OTP verify
router.post('/resend-otp', authController.resendOtp);

router.put(
  '/users/device-token',
  authMiddleware.authenticate,
  authController.updateDeviceToken
);

module.exports = router;
