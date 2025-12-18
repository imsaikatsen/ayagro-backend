const investorService = require('../services/investor.service');
const User = require('../models/user.model');

class InvestorController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const investor = await investorService.createInvestor(data);
      res.status(201).json({
        success: true,
        message: 'Investor created successfully',
        data: investor,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const investors = await investorService.getAllInvestors(page, limit);
      res.status(200).json({ message: 'Investors fetched', data: investors });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const investor = await investorService.getInvestorById(req.params.id);
      res.status(200).json({ message: 'Investor fetched', data: investor });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await investorService.deleteInvestorById(req.params.id);
      res.status(200).json({ message: 'Investor deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getMyProfile(req, res, next) {
    try {
      const userId = req.user.id; // from JWT
      const investor = await investorService.getMyProfile(userId);

      res.status(200).json({
        success: true,
        message: 'My investor profile fetched',
        data: investor,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InvestorController();
