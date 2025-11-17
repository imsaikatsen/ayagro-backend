const express = require('express');
const router = express.Router();
const controller = require('../controllers/asoleExpress.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  asoleExpressSchema,
} = require('../validations/asoleExpress.validation');

// CRUD routes
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(asoleExpressSchema),
  controller.create
);

router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  controller.getAll
);
router.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  controller.getById
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(asoleExpressSchema),
  controller.update
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  controller.delete
);

// OTP routes
router.post(
  '/:id/generate-otp',
  authMiddleware.authenticate,
  controller.generateOtp
);
router.post('/:id/verify-otp', controller.verifyOtp);
router.post('/:id/resend-otp', controller.resendOtp);

module.exports = router;
