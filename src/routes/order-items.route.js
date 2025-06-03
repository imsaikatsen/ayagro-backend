const express = require('express');
const router = express.Router();
const orderItemsController = require('../controllers/order-items.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const validate = require('../middlewares/validate.middleware');
const {
  createOrderItemSchema,
  updateOrderItemSchema,
} = require('../validations/order-items.validation');

router.post(
  '/create',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  validate(createOrderItemSchema),
  orderItemsController.create
);

router.get('/', authMiddleware.authenticate, orderItemsController.getAll);
router.get('/:id', authMiddleware.authenticate, orderItemsController.getById);
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  validate(updateOrderItemSchema),
  orderItemsController.update
);
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  orderItemsController.delete
);

module.exports = router;

//orderController
