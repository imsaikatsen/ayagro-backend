// routes/product.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const productController = require('../controllers/product.controller');
const upload = require('../config/multerConfig');
const validate = require('../middlewares/validate.middleware');
const productValidationSchema = require('../validations/product.validation');

router.post(
  '/create',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('productImage'),
  validate(productValidationSchema.createProductSchema),
  productController.create
);

router.get('/', authMiddleware.authenticate, productController.getAll);
router.get('/:id', authMiddleware.authenticate, productController.getById);
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  upload.single('productImage'),
  productController.update
);
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  productController.delete
);

module.exports = router;
