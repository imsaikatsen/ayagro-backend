const moduleRepository = require('../repositories/module.repository');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/apiError');

class ModuleService {
  async getAllModules() {
    return await moduleRepository.findAll();
  }

  async updateUserModules(userId, modules) {
    const allModules = await moduleRepository.findAll();
    const validModules = allModules.map((m) => m.name);

    const filteredModules = modules.filter((m) => validModules.includes(m));

    const updatedUser = await userRepository.updateById(userId, {
      modules: filteredModules,
    });

    if (!updatedUser) throw new ApiError(404, 'User not found');

    return updatedUser;
  }
}

module.exports = new ModuleService();
