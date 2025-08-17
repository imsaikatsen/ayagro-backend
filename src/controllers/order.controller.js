const orderService = require('../services/order.service');

class OrderController {
  // Create a new order
  async create(req, res, next) {
    try {
      const orderData = req.body;
      orderData.user_id = req.user.id;
      const newOrder = await orderService.createOrder(orderData);
      res.status(201).json({
        message: 'Order created successfully',
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await orderService.getPaginatedOrders(req.query);
      res.status(200).json({
        message: 'Orders fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get order by ID
  async getById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(200).json({
        message: 'Order fetched successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update order by ID
  async update(req, res, next) {
    try {
      const updatedOrder = await orderService.updateOrderById(
        req.params.id,
        req.body
      );
      res.status(200).json({
        message: 'Order updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete order by ID
  async delete(req, res, next) {
    try {
      await orderService.deleteOrderById(req.params.id);
      res.status(200).json({
        message: 'Order deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProof(req, res, next) {
    try {
      const orderId = req.params.id;
      const filename = req.file.filename;
      const result = await orderService.attachProof(orderId, filename);
      res.status(200).json({
        message: 'Proof of payment uploaded successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const orderId = req.params.id;
      const result = await orderService.getOrderDetails(orderId, req.user.id);
      res.status(200).json({
        message: 'Order project details fetched',
        data: result,
      });
    } catch (error) {
      next(error);
    }

    try {
      const orderId = req.params.id;
      const result = await orderService.getOrderDetails(orderId, req.user.id);
      res.status(200).json({
        message: 'Order proof-view data fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProofView(req, res, next) {
    try {
      const orderId = req.params.id;
      const result = await orderService.getOrderDetails(orderId, req.user.id);
      res.status(200).json({
        message: 'Order project details for proof view',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const userId = req.user.id;

      const result = await orderService.cancelOrder(orderId, userId);

      res.status(200).json({
        message: 'Order cancelled successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
