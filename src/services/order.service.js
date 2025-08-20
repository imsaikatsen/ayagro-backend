const orderRepository = require('../repositories/order.repository');
const ApiError = require('../utils/apiError');
const sendPushNotification = require('../utils/sendPushNotification');

const Order = require('../models/order.model');
const OrderItem = require('../models/order-items.model');
const Product = require('../models/product.model');
const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const Counter = require('../models/counter.model');

class OrderService {
  async createOrder(data) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'order' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    data.orderNumber = counter?.seq || 1;
    return await orderRepository.create(data);
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
    delete orderObj.user_id.profile;

    return {
      ...orderObj, // Convert Mongoose doc to plain JS object
      customerName: fullName,
    };
  }

  // async updateOrderById(orderId, updateData) {
  //   const updated = await orderRepository.updateById(orderId, updateData);
  //   if (!updated) throw new ApiError(500, 'Failed to update order');
  //   return updated;
  // }

  // async updateOrderById(orderId, updateData) {
  //   const existingOrder = await orderRepository.findById(orderId);

  //   if (!existingOrder) throw new ApiError(404, 'Order not found');

  //   // Only set activationDate if status changes from booked → active
  //   if (
  //     existingOrder.orderStatus === 'booked' &&
  //     updateData.orderStatus === 'active'
  //   ) {
  //     updateData.activationDate = new Date();
  //   }

  //   // Handle profit disbursement toggle
  //   if (updateData.hasOwnProperty('profitDisbursed')) {
  //     if (
  //       existingOrder.orderStatus !== 'completed' ||
  //       existingOrder.paymentStatus !== 'Paid'
  //     ) {
  //       throw new ApiError(
  //         400,
  //         'Profit can only be disbursed if order is completed and payment is paid'
  //       );
  //     }

  //     if (
  //       updateData.profitDisbursed === true &&
  //       !existingOrder.profitDisbursed
  //     ) {
  //       updateData.profitDisbursedAt = new Date();
  //     } else if (
  //       updateData.profitDisbursed === false &&
  //       existingOrder.profitDisbursed
  //     ) {
  //       updateData.profitDisbursedAt = null; // optional, if toggling back
  //     }
  //   }

  //   const updated = await orderRepository.updateById(orderId, updateData);
  //   if (!updated) throw new ApiError(500, 'Failed to update order');
  //   return updated;
  // }

  async updateOrderById(orderId, updateData) {
    const existingOrder = await orderRepository.findById(orderId);
    if (!existingOrder) throw new ApiError(404, 'Order not found');

    // Only allow profitDisbursed toggle if eligible
    if (updateData.profitDisbursed) {
      if (
        existingOrder.orderStatus !== 'completed' ||
        existingOrder.paymentStatus !== 'Paid'
      ) {
        throw new ApiError(
          400,
          'Cannot disburse profit: order not completed or not paid'
        );
      }
    }

    // Prevent undoing a disbursement
    if (existingOrder.profitDisbursed && updateData.profitDisbursed === false) {
      throw new ApiError(400, 'Cannot undo a disbursed order');
    }

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
    if (!order) throw new ApiError(404, 'Order not found');

    const items = await OrderItem.find({ order_id: order._id }).populate(
      'product_id'
    );
    if (!items.length) throw new ApiError(404, 'Order items not found');

    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) throw new ApiError(404, 'User profile not found');

    const item = items[0];
    const product = item.product_id;

    const unit = item.quantity;
    const unitPrice = item.price;
    const totalInvestment = unit * unitPrice;

    const minRate = product.earningRateMin;
    const maxRate = product.earningRateMax;

    const netReturnMin = Math.floor(totalInvestment * (minRate / 100));
    const netReturnMax = Math.ceil(totalInvestment * (maxRate / 100));

    const totalReturnMin = totalInvestment + netReturnMin;
    const totalReturnMax = totalInvestment + netReturnMax;

    return {
      project: {
        id: product._id,
        name: product.name,
        unitPrice,
        unit,
        totalInvestment,
        expectedROI: `${minRate}% ~ ${maxRate}%`,
        estimatedProfitRange: [netReturnMin, netReturnMax],
        location: product.location,
        duration: product.duration,
        investmentDate: order.createdAt,
        completionDate: null,
        status: order.orderStatus,
        productImage: product.productImage || null,
      },
      bankInfo: {
        accountName: `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`,
        accountNumber: profile.bankingInfo.accountNumber,
        bankName: profile.bankingInfo.bankName,
        branchName: profile.bankingInfo.branch,
      },
      profitSimulation: {
        earningRateRange: `${minRate}% ~ ${maxRate}%`,
        duration: product.duration,
        totalInvestment,
        netReturn: {
          min: netReturnMin,
          max: netReturnMax,
        },
        totalReturn: {
          min: totalReturnMin,
          max: totalReturnMax,
        },
      },
      proofOfPayment: order.proofOfPayment || null,
    };
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) throw new ApiError(404, 'Order not found');

    if (order.orderStatus === 'cancelled') {
      throw new ApiError(400, 'Order is already cancelled');
    }

    if (order.orderStatus === 'completed') {
      throw new ApiError(400, 'Completed order cannot be cancelled');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: 'cancelled' },
      { new: true }
    );

    return updatedOrder;
  }

  async getPaginatedOrders({ page = 1, limit = 10, search = '' }) {
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      if (!isNaN(search)) {
        // search by orderNumber
        query.orderNumber = Number(search);
      } else {
        // search by customerName (profile firstName/lastName)
        const profiles = await Profile.find({
          $or: [
            { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
            { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
          ],
        }).select('user_id');

        const userIds = profiles.map((p) => p.user_id);
        query.user_id = { $in: userIds };
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    // Get all user_ids
    const userIds = orders.map((order) => order.user_id).filter(Boolean); // remove nulls

    // Fetch related profiles in one go
    const profiles = await Profile.find({
      user_id: { $in: userIds },
    })
      .select(
        'user_id personalInfo.firstName personalInfo.lastName personalInfo.phone personalInfo.email'
      )
      .lean();

    const profileMap = {};
    profiles.forEach((profile) => {
      profileMap[profile.user_id.toString()] = profile;
    });

    const enrichedOrders = orders.map((order) => {
      let customerName = 'Unknown';
      let phone = '';
      let email = '';

      const profile = profileMap[order.user_id?.toString()];
      if (profile?.personalInfo) {
        const first = profile.personalInfo.firstName || '';
        const last = profile.personalInfo.lastName || '';
        phone = profile.personalInfo.phone || '';
        email = profile.personalInfo.email || '';
        customerName = `${first} ${last}`.trim();
      }

      return {
        ...order,
        customerName,
        phone,
        email,
      };
    });

    return {
      orders: enrichedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = new OrderService();
