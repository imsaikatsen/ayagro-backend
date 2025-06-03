const orderItemRepository = require('../repositories/order-items.repository');
const ApiError = require('../utils/apiError');

class OrderItemService {
  async create(data) {
    return await orderItemRepository.create(data);
  }

  async getAll() {
    return await orderItemRepository.findAll();
  }

  async getById(id) {
    const item = await orderItemRepository.findById(id);
    if (!item) throw new ApiError(404, 'Order item not found');
    return item;
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
