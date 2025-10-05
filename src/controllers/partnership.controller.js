const partnershipService = require('../services/partnership.service');

class PartnershipController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const partnership = await partnershipService.createPartnership(data);
      res.status(201).json({
        success: true,
        message: 'Partnership created successfully',
        data: partnership,
      });
    } catch (err) {
      next(err);
    }
  }
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const partnerships = await partnershipService.getAllPartnerships(
        page,
        limit
      );
      res
        .status(200)
        .json({ message: 'Partnerships fetched', data: partnerships });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const partnership = await partnershipService.getPartnershipById(
        req.params.id
      );
      res
        .status(200)
        .json({ message: 'Partnership fetched', data: partnership });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await partnershipService.deletePartnershipById(req.params.id);
      res.status(200).json({ message: 'Partnership deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PartnershipController();
