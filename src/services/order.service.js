const orderRepository = require('../repositories/order.repository');
const ApiError = require('../utils/apiError');

class OrderService {
  async createOrder(data) {
    return await orderRepository.create(data);
  }

  async getAllOrders() {
    return await orderRepository.findAll();
  }

  async getOrderById(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  async updateOrderById(orderId, updateData) {
    const updated = await orderRepository.updateById(orderId, updateData);
    if (!updated) throw new ApiError(500, 'Failed to update order');
    return updated;
  }

  async deleteOrderById(orderId) {
    const deleted = await orderRepository.deleteById(orderId);
    if (!deleted) throw new ApiError(500, 'Failed to delete order');
    return;
  }
}

module.exports = new OrderService();
