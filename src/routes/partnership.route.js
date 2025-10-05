const express = require('express');
const router = express.Router();
const partnershipController = require('../controllers/partnership.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { partnershipSchema } = require('../validations/partnership.validation');

// Public endpoint for creating partnership
router.post('/', validate(partnershipSchema), partnershipController.create);

// Get all partnerships - Admin only
router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  partnershipController.getAll
);

// Get by ID - Admin only
router.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  partnershipController.getById
);

// Delete partnership - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  partnershipController.delete
);

module.exports = router;
