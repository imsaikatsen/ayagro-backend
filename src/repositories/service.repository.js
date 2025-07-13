const Service = require('../models/service.model');

class ServiceRepository {
  async create(data) {
    return await Service.create(data);
  }

  async findById(id) {
    return await Service.findById(id);
  }

  async findByName(name) {
    return await Service.findOne({ name });
  }

  async findAll() {
    return await Service.find();
  }

  async updateById(id, updateData) {
    return await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Service.findByIdAndDelete(id);
  }
}

module.exports = new ServiceRepository();
