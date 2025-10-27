const Faq = require('../models/faq.model');

class FaqRepository {
  async create(data) {
    return await Faq.create(data);
  }

  // async findAll() {
  //   return await Faq.find();
  // }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [faqs, total] = await Promise.all([
      Faq.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Faq.countDocuments(),
    ]);

    return {
      faqs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    return await Faq.findById(id);
  }

  async updateById(id, updateData) {
    return await Faq.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Faq.findByIdAndDelete(id);
  }
}

module.exports = new FaqRepository();
