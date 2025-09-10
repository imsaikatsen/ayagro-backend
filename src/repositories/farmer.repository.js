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
      .populate('addedBy', 'name email role') // populate who added the farmer
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first
    const total = await Farmer.countDocuments();
    return {
      total,
      page,
      limit,
      data: farmers,
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
