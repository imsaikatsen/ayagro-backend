const farmerService = require('../services/farmer.service');
const Product = require('../models/product.model');

class FarmerController {
  async create(req, res, next) {
    try {
      const farmerData = req.body;

      if (req.files) {
        if (req.files.idProof)
          farmerData.idProof = req.files.idProof[0].filename;
        if (req.files.landDeed)
          farmerData.landDeed = req.files.landDeed[0].filename;
      }

      // Add reference to the logged-in user
      farmerData.addedBy = req.user.id;
      // ✅  validate projectIds before save
      if (farmerData.projectIds && farmerData.projectIds.length > 0) {
        const validProjects = await Product.find({
          _id: { $in: farmerData.projectIds },
        });

        if (validProjects.length !== farmerData.projectIds.length) {
          return res.status(400).json({
            message: 'Some selected projects do not exist or are inactive.',
          });
        }
      }

      const farmer = await farmerService.createFarmer(farmerData);
      res.status(201).json({ message: 'Farmer created', data: farmer });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const farmers = await farmerService.getAllFarmers(page, limit);
      res.status(200).json({ message: 'Farmers fetched', data: farmers });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const farmer = await farmerService.getFarmerById(req.params.id);
      res.status(200).json({ message: 'Farmer fetched', data: farmer });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;

      if (req.files) {
        if (req.files.idProof)
          updateData.idProof = req.files.idProof[0].filename;
        if (req.files.landDeed)
          updateData.landDeed = req.files.landDeed[0].filename;
      }

      const updated = await farmerService.updateFarmerById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'Farmer updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await farmerService.deleteFarmerById(req.params.id);
      res.status(200).json({ message: 'Farmer deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FarmerController();
