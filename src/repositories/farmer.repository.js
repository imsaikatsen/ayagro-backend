// repositories/farmer.repository.js
const Farmer = require('../models/farmer.model');

class FarmerRepository {
  // Create a new farmer
  async create(data) {
    const farmer = new Farmer(data);
    return await farmer.save();
  }

  // Get all farmers with pagination
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const farmers = await Farmer.find()
      .populate('addedBy', 'name email role')
      .populate(
        'projectIds',
        'name status duration location price return earningRateMin earningRateMax'
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const formattedFarmers = farmers.map((farmer) => {
      const f = farmer.toObject();
      f.products = f.projectIds; // rename field
      delete f.projectIds; // remove original

      f.products = f.products.map((product) => {
        let maturityDate = null;

        if (product.status === 'live') {
          const startDate = product.startDate
            ? new Date(product.startDate)
            : new Date();
          const duration = parseInt(product.duration.split(' ')[0]);
          maturityDate = new Date(startDate);
          maturityDate.setMonth(maturityDate.getMonth() + duration);
          product.maturityDate = maturityDate.toISOString().split('T')[0];
        } else {
          product.maturityDate = null;
        }

        // 🔹 Ensure updateText exists
        if (!product.updateText) product.updateText = 'No updates yet';

        // 🔹 Optional: auto status update if maturity passed
        const now = new Date();
        if (
          maturityDate &&
          product.status !== 'completed' &&
          now > maturityDate
        ) {
          product.status = 'completed';
        }

        return product;
      });
      return f;
    });

    const total = await Farmer.countDocuments();
    return {
      total,
      page,
      limit,
      data: formattedFarmers,
    };
  }

  // Get farmer by ID
  async findById(id) {
    const farmer = await Farmer.findById(id).populate(
      'addedBy',
      'name email role'
    );
    if (!farmer) throw new Error('Farmer not found');
    return farmer;
  }

  // Update farmer by ID
  async updateById(id, data) {
    const updatedFarmer = await Farmer.findByIdAndUpdate(id, data, {
      new: true, // return the updated document
      runValidators: true, // run schema validators
    }).populate('addedBy', 'name email role');

    if (!updatedFarmer) throw new Error('Farmer not found');
    return updatedFarmer;
  }

  // Delete farmer by ID
  async deleteById(id) {
    const deletedFarmer = await Farmer.findByIdAndDelete(id);
    if (!deletedFarmer) throw new Error('Farmer not found');
    return deletedFarmer;
  }
}

module.exports = new FarmerRepository();
