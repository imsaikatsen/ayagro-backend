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

  // async updateById(id, updateData) {
  //   const updated = await orderItemRepository.updateById(id, updateData);
  //   if (!updated) throw new ApiError(500, 'Failed to update order item');
  //   return updated;
  // }

  async updateById(id, updateData) {
    const updatedItem = await orderItemRepository.updateById(id, updateData);
    if (!updatedItem) throw new ApiError(500, 'Failed to update order item');

    // Auto-activate item when it's paid and still booked
    if (
      updateData.paymentStatus === 'Paid' &&
      (updatedItem.orderStatus === 'booked' || !updatedItem.orderStatus)
    ) {
      updatedItem.orderStatus = 'active';
      if (!updatedItem.activationDate) updatedItem.activationDate = new Date();
      // Save changes (updatedItem is a mongoose doc when populated)
      try {
        await updatedItem.save();
      } catch (e) {
        // fallback: update via repository
        await orderItemRepository.updateById(id, {
          orderStatus: updatedItem.orderStatus,
          activationDate: updatedItem.activationDate,
        });
      }
    }

    // Recalculate parent order paymentStatus
    const orderId = updatedItem.order_id?._id || updatedItem.order_id;
    if (orderId) {
      const allItems = await orderItemRepository.findByOrderId(orderId);
      const paidCount = allItems.filter(
        (i) => i.paymentStatus === 'Paid'
      ).length;
      const totalCount = allItems.length;

      let orderPaymentStatus = 'Unpaid';
      if (paidCount === totalCount) orderPaymentStatus = 'Paid';
      else if (paidCount > 0) orderPaymentStatus = 'Partially Paid';

      await orderRepository.updatePaymentStatus(orderId, orderPaymentStatus);
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
