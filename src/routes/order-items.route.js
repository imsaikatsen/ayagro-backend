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
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  validate(createOrderItemSchema),
  orderItemsController.create
);
// Get all order items (authenticated users)
router.get('/', authMiddleware.authenticate, orderItemsController.getAll);
// Get all items by order ID
router.get(
  '/order/:orderId',
  authMiddleware.authenticate,
  orderItemsController.getByOrderId
);
// Get single item by ID
router.get('/:id', authMiddleware.authenticate, orderItemsController.getById);

// Update order item (admin only)
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

//  Partial update for paymentStatus or orderStatus
router.patch(
  '/:id/status',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  orderItemsController.updateOrderItemStatus // controller function we added
);

router.get(
  '/grouped/:orderId',
  authMiddleware.authenticate,
  orderItemsController.getByOrderIdGrouped
);

module.exports = router;

//orderController
