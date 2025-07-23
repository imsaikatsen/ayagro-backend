const orderItemService = require('../services/order-items.service');

class OrderItemController {
  async create(req, res, next) {
    try {
      const item = await orderItemService.create(req.body);
      res.status(201).json({ message: 'Order item created', data: item });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const items = await orderItemService.getAll();
      res.status(200).json({ message: 'Fetched successfully', data: items });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const item = await orderItemService.getById(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      res.status(200).json({ message: 'Fetched successfully', data: item });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await orderItemService.updateById(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: 'Updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await orderItemService.deleteById(req.params.id);
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderItemController();
