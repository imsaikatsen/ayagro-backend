const headerCardService = require('../services/headerCard.service');

class HeaderCardController {
  async create(req, res, next) {
    try {
      const data = req.body;
      if (req.file) {
        data.icon = req.file.filename;
      }
      const created = await headerCardService.createHeaderCard(data);
      res.status(201).json({ message: 'HeaderCard created', data: created });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const cards = await headerCardService.getAllHeaderCards();
      res.status(200).json({ message: 'HeaderCards fetched', data: cards });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const card = await headerCardService.getHeaderCardById(req.params.id);
      res.status(200).json({ message: 'HeaderCard fetched', data: card });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.icon = req.file.filename;
      }
      const updated = await headerCardService.updateHeaderCardById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'HeaderCard updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await headerCardService.deleteHeaderCardById(req.params.id);
      res.status(200).json({ message: 'HeaderCard deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HeaderCardController();
