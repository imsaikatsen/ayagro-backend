const blogService = require('../services/blog.service');

class BlogController {
  async create(req, res, next) {
    try {
      const blogData = req.body;
      if (req.file) blogData.image = req.file.filename;
      const blog = await blogService.createBlog(blogData);
      res.status(201).json({ message: 'Blog created', data: blog });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const blogs = await blogService.getAllBlogs(page, limit);
      res.status(200).json({
        message: 'Blogs fetched',
        data: {
          blogs: blogs.blogs,
          total: blogs.total,
          page: blogs.page,
          limit: blogs.limit,
          totalPages: blogs.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      res.status(200).json({ message: 'Blog fetched', data: blog });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) updateData.image = req.file.filename;
      const updated = await blogService.updateBlogById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'Blog updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await blogService.deleteBlogById(req.params.id);
      res.status(200).json({ message: 'Blog deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BlogController();
