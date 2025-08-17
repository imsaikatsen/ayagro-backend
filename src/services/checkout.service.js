const checkoutRepository = require('../repositories/checkout.repository');
const orderRepository = require('../repositories/order.repository');
const orderItemRepository = require('../repositories/order-items.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/apiError');
const User = require('../models/user.model');
const sendSMS = require('../utils/sendSMS');

class checkoutService {
  async getCheckoutPreview(userId) {
    const cartItems = await checkoutRepository.findCartItemsByUser(userId);
    if (!cartItems || cartItems.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    let totalAmount = 0;
    const items = cartItems.map((item) => {
      const product = item.product_id;
      const quantity = item.quantity;
      const unitPrice = product.price;
      const total = unitPrice * quantity;
      totalAmount += total;

      return {
        projectName: product.name,
        unitPrice,
        quantity,
        total,
      };
    });

    // Fetch profile instead of user
    const profile = await checkoutRepository.findProfileByUserId(userId);
    if (!profile) throw new ApiError(404, 'Profile not found');

    const bankInfo = {
      accountName: `${profile.personalInfo?.firstName || ''} ${
        profile.personalInfo?.lastName || ''
      }`.trim(),
      accountNumber: profile.bankingInfo?.accountNumber || '',
      bankName: profile.bankingInfo?.bankName || '',
      branchName: profile.bankingInfo?.branch || '',
    };

    const paymentOptions = ['Check', 'Online Transaction'];

    return {
      items,
      totalAmount,
      bankInfo,
      paymentOptions,
    };
  }
  async checkout(userId, paymentMethod, isInterested) {
    const cartItems = await checkoutRepository.findByUser(userId);
    if (!cartItems || cartItems.length === 0) {
      throw new ApiError(400, 'Your cart is empty');
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await productRepository.findById(item.product_id);
      if (!product) throw new ApiError(404, 'Product not found');
      totalAmount += item.quantity * product.price;
    }

    const order = await orderRepository.create({
      user_id: userId,
      totalAmount,
      orderStatus: 'booked',
      paymentStatus: 'Unpaid',
      paymentMethod,
      isInterested,
    });

    const orderItems = [];
    for (const item of cartItems) {
      const product = await productRepository.findById(item.product_id);
      const orderItem = await orderItemRepository.create({
        order_id: order._id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
      orderItems.push(orderItem);
    }

    await checkoutRepository.deleteAllByUser(userId);

    try {
      const user = await User.findById(userId);
      if (user?.phone) {
        const formattedOrderId = order.orderNumber.toString().padStart(4, '0');
        const message = `Your project has been booked successfully.Thanks for stay with Ayagro.Order ID: ${formattedOrderId}`;
        await sendSMS(user.phone, message);
      }
    } catch (smsErr) {
      console.error('❌ Failed to send booking SMS:', smsErr.message);
    }

    return { order, orderItems, project: cartItems[0]?.product_id };
  }

  async transferGuestCartToUser(cart_token, user_id) {
    const guestItems = await checkoutRepository.findAllByCartToken(cart_token);
    if (!guestItems.length) return false;

    for (const item of guestItems) {
      const existing = await checkoutRepository.findByUserAndProduct(
        user_id,
        item.product_id
      );
      if (existing) {
        existing.quantity += item.quantity;
        await existing.save();
        await checkoutRepository.deleteItem(item._id);
      } else {
        item.user_id = user_id;
        item.cart_token = undefined;
        await item.save();
      }
    }

    return true;
  }

  async getUserOrders(userId, page, limit) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderRepository.findOrdersByUserPaginated(userId, skip, limit),
      orderRepository.countOrdersByUser(userId),
    ]);

    const result = [];

    for (const order of orders) {
      const items = await orderItemRepository.findByOrderId(order._id);

      const formattedItems = items.map((item) => {
        const product = item.product_id || {};
        const quantity = item.quantity;
        const unitPrice = item.price;
        const totalInvestment = quantity * unitPrice;

        const minRate = product.earningRateMin || 0;
        const maxRate = product.earningRateMax || 0;

        // Business rounding
        const netReturnMin = Math.floor(totalInvestment * (minRate / 100));
        const netReturnMax = Math.ceil(totalInvestment * (maxRate / 100));

        const totalReturnMin = totalInvestment + netReturnMin;
        const totalReturnMax = totalInvestment + netReturnMax;

        return {
          productId: product._id || null,
          productName: product.name || 'Unknown Product',
          price: unitPrice,
          quantity,
          totalInvestment,
          duration: product.duration || 'N/A',
          earningRateMin: minRate,
          earningRateMax: maxRate,
          profitSimulation: {
            min: netReturnMin,
            max: netReturnMax,
            totalReturnMin,
            totalReturnMax,
          },
          location: product.location || 'Unknown',
          productImage: product.productImage || null,
        };
      });

      result.push({
        orderId: order._id,
        orderNumber: order.orderNumber?.toString().padStart(4, '0') || null,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: formattedItems,
      });
    }

    return {
      data: result,
      pagination: {
        totalOrders: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    };
  }
}

module.exports = new checkoutService();
