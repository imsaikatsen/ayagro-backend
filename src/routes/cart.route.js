const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createCartSchema,
  updateCartSchema,
} = require('../validations/cart.validation');

router.post(
  '/create',
  authMiddleware.authenticate,
  validate(createCartSchema),
  cartController.create
);

router.get('/', authMiddleware.authenticate, cartController.getAll);
router.get('/:id', authMiddleware.authenticate, cartController.getById);

router.put(
  '/:id',
  authMiddleware.authenticate,
  validate(updateCartSchema),
  cartController.update
);

router.delete('/:id', authMiddleware.authenticate, cartController.delete);
router.delete('/', authMiddleware.authenticate, cartController.clear); // Clear all items

module.exports = router;
