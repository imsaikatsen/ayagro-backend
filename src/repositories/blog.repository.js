const Blog = require('../models/blog.model');

class BlogRepository {
  async create(data) {
    return await Blog.create(data);
  }

  async findById(id) {
    return await Blog.findById(id);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Blog.countDocuments();
    // return { blogs, total, page, pages: Math.ceil(total / limit) };
    return { blogs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateById(id, updateData) {
    return await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Blog.findByIdAndDelete(id);
  }
}

module.exports = new BlogRepository();
