const moduleService = require('../services/module.service');

class ModuleController {
  async getModules(req, res, next) {
    console.log('route working');
    try {
      const modules = await moduleService.getAllModules();
      res.status(200).json({ modules });
    } catch (error) {
      next(error);
    }
  }

  async updateUserModules(req, res, next) {
    try {
      const { id } = req.params;
      const { modules } = req.body;

      const updatedUser = await moduleService.updateUserModules(id, modules);

      res.status(200).json({
        message: 'User modules updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ModuleController();
