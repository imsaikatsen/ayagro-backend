const HeaderCard = require('../models/headerCard.model');

class HeaderCardRepository {
  async create(data) {
    return await HeaderCard.create(data);
  }

  async findById(id) {
    return await HeaderCard.findById(id);
  }

  async findAll() {
    return await HeaderCard.find();
  }

  async updateById(id, updateData) {
    return await HeaderCard.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await HeaderCard.findByIdAndDelete(id);
  }
}

module.exports = new HeaderCardRepository();
