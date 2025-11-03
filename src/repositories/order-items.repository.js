const OrderItem = require('../models/order-items.model');

class OrderItemRepository {
  async create(data) {
    return await OrderItem.create(data);
  }

  async findAll() {
    return await OrderItem.find().populate('order_id product_id');
  }

  async findById(id) {
    return await OrderItem.findById(id).populate('order_id product_id');
  }

  async updateById(id, updateData) {
    return await OrderItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('order_id product_id');
  }

  async deleteById(id) {
    return await OrderItem.findByIdAndDelete(id);
  }

  async findByOrderId(orderId) {
    return await OrderItem.find({ order_id: orderId })
      .populate('product_id')
      .populate('order_id');
  }
}

module.exports = new OrderItemRepository();
