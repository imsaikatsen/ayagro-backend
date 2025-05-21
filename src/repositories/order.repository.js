const Order = require('../models/order.model');

class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async findAll() {
    return await Order.find().populate('user_id');
  }

  async findById(orderId) {
    return await Order.findById(orderId).populate('user_id');
  }

  async updateById(orderId, updateData) {
    return await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(orderId) {
    return await Order.findByIdAndDelete(orderId);
  }
}

module.exports = new OrderRepository();
