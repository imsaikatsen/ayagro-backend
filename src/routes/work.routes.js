// routes/work.routes.js
const express = require('express');
const router = express.Router();
const workController = require('../controllers/work.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/workMulterConfig');
const validate = require('../middlewares/validate.middleware');
const { workSchema } = require('../validations/work.validation');

// Create work - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'manager', 'super_admin'),
  upload.single('image'),
  validate(workSchema),
  workController.create
);

// Public
router.get('/', workController.getAll);
router.get('/:id', workController.getById);

// Update work - Admin only
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'manager', 'super_admin'),
  upload.single('image'),
  workController.update
);

// Delete work - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  workController.delete
);

module.exports = router;
