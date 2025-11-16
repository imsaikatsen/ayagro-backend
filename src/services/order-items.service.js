const orderItemRepository = require('../repositories/order-items.repository');
const orderRepository = require('../repositories/order.repository');
const ApiError = require('../utils/apiError');

class OrderItemService {
  async create(data) {
    return await orderItemRepository.create(data);
  }

  // async getAll() {
  //   return await orderItemRepository.findAll();
  // }

  // async getById(id) {
  //   const item = await orderItemRepository.findById(id);
  //   if (!item) throw new ApiError(404, 'Order item not found');
  //   return item;
  // }

  // service/orderItemService.js

  async getAll() {
    const items = await orderItemRepository.findAll();

    return items.map((item) => {
      const { product_id, order_id, ...rest } = item._doc || item;

      return {
        ...rest,
        product: product_id,
        order: order_id,
      };
    });
  }

  async getById(id) {
    const item = await orderItemRepository.findById(id);

    if (!item) return null;

    const { product_id, order_id, ...rest } = item._doc || item;

    return {
      ...rest,
      product: product_id,
      order: order_id,
    };
  }

  async getByOrderId(orderId) {
    const items = await orderItemRepository.findByOrderId(orderId);

    return items.map((item) => {
      const { product_id, order_id, ...rest } = item._doc || item;

      return {
        ...rest,
        product: product_id,
        order: order_id,
      };
    });
  }

  async updateById(id, updateData) {
    const updatedItem = await orderItemRepository.updateById(id, updateData);
    if (!updatedItem) throw new ApiError(500, 'Failed to update order item');

    // Auto-activate item when paid and still booked
    if (
      updateData.paymentStatus === 'Paid' &&
      (updatedItem.orderStatus === 'booked' || !updatedItem.orderStatus)
    ) {
      updatedItem.orderStatus = 'active';
      if (!updatedItem.activationDate) updatedItem.activationDate = new Date();
      try {
        await updatedItem.save();
      } catch (e) {
        await orderItemRepository.updateById(id, {
          orderStatus: updatedItem.orderStatus,
          activationDate: updatedItem.activationDate,
        });
      }
    }

    // ✅ Recalculate parent order status
    if (updatedItem.order_id) {
      await require('./order.service').recalcParentOrder(
        updatedItem.order_id._id || updatedItem.order_id
      );
    }

    const { product_id, order_id, ...rest } = updatedItem._doc || updatedItem;
    return { ...rest, product: product_id, order: order_id };
  }

  async deleteById(id) {
    const deleted = await orderItemRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete order item');
    return;
  }
}

module.exports = new OrderItemService();
