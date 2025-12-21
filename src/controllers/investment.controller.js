// controllers/investment.controller.js
const Investment = require('../models/investment.model');

class InvestmentController {
  async create(req, res, next) {
    try {
      const investorId = req.params.id; // get from URL
      const data = { ...req.body, investorId }; // merge with request body
      const investment = await Investment.create(data);
      res.status(201).json({ success: true, data: investment });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const investment = await Investment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({ success: true, data: investment });
    } catch (err) {
      next(err);
    }
  }

  async getByInvestor(req, res, next) {
    try {
      const investments = await Investment.find({
        investorId: req.params.investorId,
      });
      res.status(200).json({ success: true, data: investments });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InvestmentController();
