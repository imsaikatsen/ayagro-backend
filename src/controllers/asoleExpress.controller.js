const asoleExpressService = require('../services/asoleExpress.service');

class AsoleExpressController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const created = await asoleExpressService.create(data);
      res.status(201).json({ message: 'Record created', data: created });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await asoleExpressService.getAll(page, limit);
      res.status(200).json({
        message: 'Records fetched',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const item = await asoleExpressService.getById(req.params.id);
      res.status(200).json({ message: 'Record fetched', data: item });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await asoleExpressService.updateById(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: 'Record updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await asoleExpressService.deleteById(req.params.id);
      res.status(200).json({ message: 'Record deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AsoleExpressController();
