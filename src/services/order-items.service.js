const orderItemRepository = require('../repositories/order-items.repository');
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

  async updateById(id, updateData) {
    const updated = await orderItemRepository.updateById(id, updateData);
    if (!updated) throw new ApiError(500, 'Failed to update order item');
    return updated;
  }

  async deleteById(id) {
    const deleted = await orderItemRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete order item');
    return;
  }
}

module.exports = new OrderItemService();
