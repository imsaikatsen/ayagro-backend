const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmer.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/farmerMulterConfig');
const validate = require('../middlewares/validate.middleware');
const { farmerSchema } = require('../validations/farmer.validation');

// Create Farmer - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin', 'manager'),
  upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'landDeed', maxCount: 1 },
  ]),
  validate(farmerSchema),
  farmerController.create
);

// Get all farmers (Admin + Manager)
router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin', 'manager'),
  farmerController.getAll
);

// Get single farmer by ID
router.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin', 'manager'),
  farmerController.getById
);

// Update farmer - Admin only
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin', 'manager'),
  upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'landDeed', maxCount: 1 },
  ]),
  farmerController.update
);

// Delete farmer - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  farmerController.delete
);

module.exports = router;
