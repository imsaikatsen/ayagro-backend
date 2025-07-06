const faqRepository = require('../repositories/faq.repository');
const ApiError = require('../utils/apiError');

class FaqService {
  async createFaq(data) {
    return await faqRepository.create(data);
  }

  async getAllFaqs() {
    return await faqRepository.findAll();
  }

  async getFaqById(id) {
    const faq = await faqRepository.findById(id);
    if (!faq) throw new ApiError(404, 'FAQ not found');
    return faq;
  }

  async updateFaqById(id, updateData) {
    const updated = await faqRepository.updateById(id, updateData);
    if (!updated) throw new ApiError(404, 'FAQ not found');
    return updated;
  }

  async deleteFaqById(id) {
    const deleted = await faqRepository.deleteById(id);
    if (!deleted) throw new ApiError(404, 'FAQ not found');
    return;
  }
}

module.exports = new FaqService();
