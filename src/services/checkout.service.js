const checkoutRepository = require('../repositories/checkout.repository');
const orderRepository = require('../repositories/order.repository');
const orderItemRepository = require('../repositories/order-items.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/apiError');

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
      orderStatus: 'processing',
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
}

module.exports = new checkoutService();
