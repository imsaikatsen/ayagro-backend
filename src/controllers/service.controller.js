const serviceService = require('../services/service.service');

class ServiceController {
  async create(req, res, next) {
    try {
      const serviceData = req.body;
      if (req.file) {
        serviceData.serviceImage = req.file.filename;
      }
      const created = await serviceService.createService(serviceData);
      res.status(201).json({ message: 'Service created', data: created });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const services = await serviceService.getAllServices();
      res.status(200).json({ message: 'Services fetched', data: services });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      res.status(200).json({ message: 'Service fetched', data: service });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.serviceImage = req.file.filename;
      }
      const updated = await serviceService.updateServiceById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'Service updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await serviceService.deleteServiceById(req.params.id);
      res.status(200).json({ message: 'Service deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServiceController();
