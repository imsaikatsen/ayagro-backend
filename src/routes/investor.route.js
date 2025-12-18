const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investor.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { investorSchema } = require('../validations/investor.validation');

router.get(
  '/me',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('premium_investor'),
  investorController.getMyProfile
);

// ✅ Public endpoint - anyone can submit investor info
router.post('/', validate(investorSchema), investorController.create);

// ✅ Get all investors - Admin only
router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investorController.getAll
);

// ✅ Get single investor - Admin only
router.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investorController.getById
);

// ✅ Delete investor - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investorController.delete
);

module.exports = router;
