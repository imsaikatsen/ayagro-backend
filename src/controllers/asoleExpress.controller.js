const service = require('../services/asoleExpress.service');

class AsoleExpressController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const created = await service.create(data);
      res
        .status(201)
        .json({ message: 'Record created and OTP sent', data: created });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await service.getAll(page, limit);
      res.status(200).json({ message: 'Records fetched', data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const item = await service.getById(req.params.id);
      res.status(200).json({ message: 'Record fetched', data: item });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await service.updateById(req.params.id, req.body);
      res.status(200).json({ message: 'Record updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await service.deleteById(req.params.id);
      res.status(200).json({ message: 'Record deleted' });
    } catch (err) {
      next(err);
    }
  }

  // OTP endpoints
  async generateOtp(req, res, next) {
    try {
      const result = await service.generateOtp(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { code } = req.body;
      const { tempId } = req.params;
      const result = await service.verifyOtp(tempId, code);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const result = await service.resendOtp(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AsoleExpressController();
