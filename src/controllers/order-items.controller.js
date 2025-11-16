const orderItemService = require('../services/order-items.service');
const orderService = require('../services/order.service');
const OrderItem = require('../models/order-items.model');
const Order = require('../models/order.model');

class OrderItemController {
  async create(req, res, next) {
    try {
      const item = await orderItemService.create(req.body);
      res.status(201).json({ message: 'Order item created', data: item });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const items = await orderItemService.getAll();
      res.status(200).json({ message: 'Fetched successfully', data: items });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const item = await orderItemService.getById(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      res.status(200).json({ message: 'Fetched successfully', data: item });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await orderItemService.updateById(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: 'Updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async getByOrderId(req, res, next) {
    try {
      const items = await orderItemService.getByOrderId(req.params.orderId);
      res.status(200).json({ message: 'Fetched successfully', data: items });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await orderItemService.deleteById(req.params.id);
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
  async updateOrderItemStatus(req, res) {
    try {
      const { paymentStatus, orderStatus } = req.body;
      const item = await OrderItem.findById(req.params.id);

      if (!item) return res.status(404).json({ message: 'Item not found' });

      if (paymentStatus) item.paymentStatus = paymentStatus;
      if (orderStatus) item.orderStatus = orderStatus;

      await item.save();

      res.json({ message: 'Item updated successfully', data: item });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong', error: err.message });
    }
  }

  async getByOrderIdGrouped(req, res) {
    try {
      const { orderId } = req.params;

      // Recalculate parent order
      const recalculated = await orderService.recalcParentOrder(orderId);

      const order = await Order.findById(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: 'Order not found' });
      }

      const items = await OrderItem.find({ order_id: orderId }).populate(
        'product_id'
      );

      const response = {
        message: 'Fetched successfully',
        data: [
          {
            total_orders: {
              _id: order._id,
              orderNumber: order.orderNumber,
              user_id: order.user_id,
              totalAmount: order.totalAmount,
              paymentStatus: recalculated.paymentStatus, // use recalculated
              orderStatus: recalculated.orderStatus, // use recalculated
            },
            items: items.map((item) => ({
              _id: item._id,
              quantity: item.quantity,
              price: item.price,
              paymentStatus: item.paymentStatus,
              orderStatus: item.orderStatus,
              transactionId: item.transactionId,
              activationDate: item.activationDate,
              maturityDate: item.maturityDate,
              product: item.product_id,
            })),
          },
        ],
      };

      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  }
}

module.exports = new OrderItemController();
