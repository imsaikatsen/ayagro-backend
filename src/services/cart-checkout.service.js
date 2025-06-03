const cartRepository = require('../repositories/cart-checkout.repository');
const orderRepository = require('../repositories/order.repository');
const orderItemRepository = require('../repositories/order-items.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/apiError');

class CartCheckoutService {
  async checkout(userId, shippingAddress) {
    const cartItems = await cartRepository.findByUser(userId);
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
      shippingAddress: shippingAddress,
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

    await cartRepository.deleteAllByUser(userId);

    return { order, orderItems };
  }
}

module.exports = new CartCheckoutService();
