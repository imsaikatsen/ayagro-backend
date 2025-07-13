const Order = require('../models/order.model');

class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async findAll() {
    return await Order.find().populate({
      path: 'user_id',
      populate: {
        path: 'profile',
        select: 'personalInfo.firstName personalInfo.lastName',
      },
    });
  }

  async findById(orderId) {
    return await Order.findById(orderId).populate({
      path: 'user_id',
      populate: {
        path: 'profile',
        select: 'personalInfo.firstName personalInfo.lastName',
      },
    });
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

  async findOrdersByUserPaginated(userId, skip, limit) {
    return await Order.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countOrdersByUser(userId) {
    return await Order.countDocuments({ user_id: userId });
  }
}

module.exports = new OrderRepository();
