const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { jobSchema } = require('../validations/job.validation');
const jobController = require('../controllers/job.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create job - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(jobSchema),
  jobController.create
);

// Public
router.get('/', jobController.getAll);
router.get('/:id', jobController.getById);

// Update job - Admin only
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(jobSchema),
  jobController.update
);

// Delete job - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  jobController.delete
);

module.exports = router;
