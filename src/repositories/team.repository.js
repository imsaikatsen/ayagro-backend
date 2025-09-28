const Team = require('../models/team.model');

class TeamRepository {
  async create(data) {
    // If no order provided, put at end
    if (!data.order) {
      const lastMember = await Team.findOne().sort('-order');
      data.order = lastMember ? lastMember.order + 1 : 1;
    }
    return await Team.create(data);
  }

  async findById(id) {
    return await Team.findById(id);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const members = await Team.find()
      .sort({ order: 1 }) // always return in order
      .skip(skip)
      .limit(limit);
    const total = await Team.countDocuments();
    return { members, total, page, pages: Math.ceil(total / limit) };
  }

  async updateById(id, updateData) {
    return await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Team.findByIdAndDelete(id);
  }

  async bulkReorder(orderData) {
    const bulkOps = orderData.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));
    await Team.bulkWrite(bulkOps);
    return await Team.find().sort({ order: 1 });
  }
}

module.exports = new TeamRepository();
