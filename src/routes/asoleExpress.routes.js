const express = require('express');
const router = express.Router();
const controller = require('../controllers/asoleExpress.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  asoleExpressSchema,
} = require('../validations/asoleExpress.validation');

// Create (admin only)
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(asoleExpressSchema),
  controller.create
);

// List & Single
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

// Update (admin only)
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(asoleExpressSchema),
  controller.update
);

// Delete (admin only)
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  controller.delete
);

module.exports = router;
