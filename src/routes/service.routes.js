const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createServiceSchema,
  updateServiceSchema,
} = require('../validations/service.validation');

const upload = require('../config/multerServiceConfig');

// Create service
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('serviceImage'),
  validate(createServiceSchema),
  serviceController.create
);

// Get all services (Public)
router.get('/', serviceController.getAll);

// Get single service (Auth required)
router.get('/:id', authMiddleware.authenticate, serviceController.getById);

// Update service
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('serviceImage'),
  validate(updateServiceSchema),
  serviceController.update
);

// Delete service
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  serviceController.delete
);

module.exports = router;
