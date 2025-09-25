const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/teamMulterConfig');
const validate = require('../middlewares/validate.middleware');
const { teamSchema } = require('../validations/team.validation');

// Create team member - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  upload.single('image'),
  validate(teamSchema),
  teamController.create
);

// Public
router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);

// Update team member - Admin only
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  upload.single('image'),
  teamController.update
);

// Delete team member - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  teamController.delete
);

// Reorder members - Admin only
router.put(
  '/reorder',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  teamController.reorder
);

module.exports = router;
