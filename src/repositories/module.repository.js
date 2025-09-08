const Module = require('../models/module.model');

class ModuleRepository {
  async create(moduleData) {
    return await Module.create(moduleData);
  }

  async findAll() {
    return await Module.find({});
  }

  async findByName(name) {
    return await Module.findOne({ name });
  }
}

module.exports = new ModuleRepository();
