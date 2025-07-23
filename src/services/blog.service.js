const blogRepository = require('../repositories/blog.repository');
const ApiError = require('../utils/apiError');

class BlogService {
  async createBlog(data) {
    return await blogRepository.create(data);
  }

  async getAllBlogs(page, limit) {
    return await blogRepository.findAll(page, limit);
  }

  async getBlogById(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  }

  async updateBlogById(id, data) {
    const updated = await blogRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update blog');
    return updated;
  }

  async deleteBlogById(id) {
    const deleted = await blogRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete blog');
    return;
  }
}

module.exports = new BlogService();
