const AsoleExpress = require('../models/asoleExpress.model');

class AsoleExpressRepository {
  async create(data) {
    return await AsoleExpress.create(data);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { isDeleted: false }; // ignore soft-deleted records
    const items = await AsoleExpress.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AsoleExpress.countDocuments(query);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await AsoleExpress.findOne({ _id: id, isDeleted: false });
  }

  async updateById(id, updateData, userId = null) {
    // Optional: track update history
    if (userId) {
      const item = await this.findById(id);
      if (item) {
        item.history.push({
          at: new Date(),
          by: userId,
          changes: updateData,
        });
        await item.save();
      }
    }

    return await AsoleExpress.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id, userId = null) {
    // Soft delete
    const item = await AsoleExpress.findById(id);
    if (!item) return null;

    item.isDeleted = true;
    item.deletedAt = new Date();
    if (userId) item.updatedBy = userId;

    await item.save();
    return item;
  }
}

module.exports = new AsoleExpressRepository();
