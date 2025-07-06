const faqService = require('../services/faq.service');

class FaqController {
  async create(req, res, next) {
    try {
      const faq = await faqService.createFaq(req.body);
      res.status(201).json({ message: 'FAQ created', data: faq });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const faqs = await faqService.getAllFaqs();
      res.status(200).json({ message: 'FAQs fetched', data: faqs });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const faq = await faqService.getFaqById(req.params.id);
      res.status(200).json({ message: 'FAQ fetched', data: faq });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await faqService.updateFaqById(req.params.id, req.body);
      res.status(200).json({ message: 'FAQ updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await faqService.deleteFaqById(req.params.id);
      res.status(200).json({ message: 'FAQ deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FaqController();
