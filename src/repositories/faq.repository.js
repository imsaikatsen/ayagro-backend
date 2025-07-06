const Faq = require('../models/faq.model');

class FaqRepository {
  async create(data) {
    return await Faq.create(data);
  }

  async findAll() {
    return await Faq.find();
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
