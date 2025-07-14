const express = require('express');
const router = express.Router();
const headerCardController = require('../controllers/headerCard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multerHeaderCardConfig');
const validate = require('../middlewares/validate.middleware'); // already used in service
const {
  createHeaderCardSchema,
  updateHeaderCardSchema,
} = require('../validations/headerCard.validation');

// Create
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('icon'),
  validate(createHeaderCardSchema),
  headerCardController.create
);

// Get all (public)
router.get('/', headerCardController.getAll);

// Get one
router.get('/:id', authMiddleware.authenticate, headerCardController.getById);

// Update
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('icon'),
  validate(updateHeaderCardSchema),
  headerCardController.update
);

// Delete
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  headerCardController.delete
);

module.exports = router;
