const orderRepository = require('../repositories/order.repository');
const ApiError = require('../utils/apiError');

const Order = require('../models/order.model');
const OrderItem = require('../models/order-items.model');
const Product = require('../models/product.model');
const Profile = require('../models/profile.model');

class OrderService {
  async createOrder(data) {
    return await orderRepository.create(data);
  }

  async getAllOrders() {
    const orders = await orderRepository.findAll();

    return orders.map((order) => {
      const firstName = order?.user_id?.profile?.personalInfo?.firstName || '';
      const lastName = order?.user_id?.profile?.personalInfo?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();

      return {
        ...order.toObject(),
        customerName: fullName,
      };
    });
  }

  async getOrderById(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    const firstName = order?.user_id?.profile?.personalInfo?.firstName || '';
    const lastName = order?.user_id?.profile?.personalInfo?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    const orderObj = order.toObject();
    delete orderObj.user_id.profile; // Remove profile to keep API clean

    return {
      ...orderObj, // Convert Mongoose doc to plain JS object
      customerName: fullName,
    };
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

  async attachProof(orderId, filename) {
    return await Order.findByIdAndUpdate(
      orderId,
      { proofOfPayment: filename },
      { new: true }
    );
  }

  async getOrderDetails(orderId, userId) {
    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) throw new Error('Order not found');

    const items = await OrderItem.find({ order_id: order._id }).populate(
      'product_id'
    );
    const profile = await Profile.findOne({ user_id: userId });

    const item = items[0];
    const unit = item.quantity;
    const unitPrice = item.price;
    const totalInvestment = unit * unitPrice;
    const product = item.product_id;

    const profitRange = [
      Math.floor(unitPrice * (product.totalRate / 100)),
      Math.ceil(unitPrice * ((product.totalRate / 100) * 1.2)),
    ];

    const capitalReturn = [
      totalInvestment + profitRange[0],
      totalInvestment + profitRange[1],
    ];

    return {
      project: {
        name: product.name,
        unitPrice,
        unit,
        totalInvestment,
        expectedROI: `${product.totalRate}%`,
        estimatedProfitRange: profitRange,
        location: product.location,
        duration: product.duration,
        investmentDate: order.createdAt,
        completionDate: null,
        status: order.orderStatus,
      },
      bankInfo: {
        accountName: `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`,
        accountNumber: profile.bankingInfo.accountNumber,
        bankName: profile.bankingInfo.bankName,
        branchName: profile.bankingInfo.branch,
      },
      profitSimulation: {
        months: parseInt(product.duration),
        roiRange: `${product.totalRate}%`,
        profitRange,
        capitalReturnRange: capitalReturn,
      },
      proofOfPayment: order.proofOfPayment || null,
    };
  }
}

module.exports = new OrderService();
