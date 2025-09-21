const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/blogMulterConfig');
const validate = require('../middlewares/validate.middleware');
const { blogSchema } = require('../validations/blog.validation');

// Create blog - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  upload.single('image'),
  validate(blogSchema),
  blogController.create
);

// Public
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);

// Update blog - Admin only
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  upload.single('image'),
  blogController.update
);

// Delete blog - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  blogController.delete
);

module.exports = router;
