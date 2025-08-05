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

  async findPaginatedAndSearch({ search, skip, limit }) {
    const query = {};

    if (search) {
      // Check if search is a valid ObjectId (full ID search)
      if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
      } else {
        // Search user by profile names or email to get userIds
        const users = await User.find({
          $or: [
            { email: { $regex: search, $options: 'i' } },
            {
              'profile.personalInfo.firstName': {
                $regex: search,
                $options: 'i',
              },
            },
            {
              'profile.personalInfo.lastName': {
                $regex: search,
                $options: 'i',
              },
            },
          ],
        }).select('_id');

        const userIds = users.map((user) => user._id);

        // If userIds found, filter orders by these user_ids
        if (userIds.length > 0) {
          query.user_id = { $in: userIds };
        } else {
          // No users matched, no orders will match
          query.user_id = null; // no result
        }
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate({
          path: 'user_id',
          populate: {
            path: 'profile',
            select: 'personalInfo.firstName personalInfo.lastName',
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return { orders, total };
  }
}

module.exports = new OrderRepository();
