// routes/category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validations/category.validation');

const upload = require('../config/multerCategoryConfig');

// Create category - Only accessible to authenticated admins
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('categoryImage'),
  validate(createCategorySchema),
  categoryController.create
);

// Get all categories - PUBLIC access (no auth)
router.get('/', categoryController.getAll);

// Get single category by ID - Accessible to any authenticated user
router.get('/:id', authMiddleware.authenticate, categoryController.getById);

// Update category - Only accessible to authenticated admins
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('categoryImage'),
  validate(updateCategorySchema),
  categoryController.update
);

// Delete category - Only accessible to authenticated admins
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  categoryController.delete
);

module.exports = router;
