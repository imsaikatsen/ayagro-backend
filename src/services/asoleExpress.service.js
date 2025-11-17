const repo = require('../repositories/asoleExpress.repository');
const { generateOtp, getExpiry } = require('../utils/otpSender');
const sendSMS = require('../utils/sendSMS'); // your existing sendSMS module
const ApiError = require('../utils/apiError');

class AsoleExpressService {
  async create(data) {
    const created = await repo.create(data);

    // Generate OTP automatically after job creation
    const otp = generateOtp();
    created.otp = otp;
    created.otpExpiresAt = getExpiry(5);
    await created.save();

    await sendSMS(
      created.phone,
      `Your OTP for Asol Express verification is ${otp}`
    );
    return created;
  }

  async getAll(page, limit) {
    return await repo.findAll(page, limit);
  }

  async getById(id) {
    const item = await repo.findById(id);
    if (!item) throw new ApiError(404, 'Record not found');
    return item;
  }

  async updateById(id, data) {
    const updated = await repo.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update');
    return updated;
  }

  async deleteById(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete');
    return;
  }

  // OTP methods
  async generateOtp(id) {
    const item = await this.getById(id);
    const now = new Date();
    if (item.otpExpiresAt && item.otpExpiresAt > now) {
      throw new ApiError(
        429,
        'OTP was recently sent. Please wait a few minutes'
      );
    }

    const otp = generateOtp();
    item.otp = otp;
    item.otpExpiresAt = getExpiry(5);
    await item.save();

    await sendSMS(
      item.phone,
      `Your OTP for Asol Express verification is ${otp}`
    );
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(id, code) {
    const item = await this.getById(id);

    if (!item.otp || !item.otpExpiresAt) {
      throw new ApiError(400, 'OTP not generated');
    }

    if (item.otpExpiresAt < new Date()) {
      throw new ApiError(400, 'OTP expired');
    }

    if (item.otp !== code) {
      throw new ApiError(400, 'Invalid OTP');
    }

    item.isVerified = true;
    item.status = 'assigned';
    item.otp = null;
    item.otpExpiresAt = null;

    await item.save();
    return {
      message: 'Phone verified successfully, job confirmed',
      data: item,
    };
  }

  async resendOtp(id) {
    const item = await this.getById(id);
    const now = new Date();

    if (
      item.otpExpiresAt &&
      item.otpExpiresAt > new Date(now.getTime() - 60000)
    ) {
      throw new ApiError(429, 'OTP was recently sent. Please wait a minute');
    }

    const otp = generateOtp();
    item.otp = otp;
    item.otpExpiresAt = getExpiry(5);
    await item.save();

    await sendSMS(
      item.phone,
      `Your OTP for Asole Express verification is ${otp}`
    );
    return { message: 'OTP resent successfully' };
  }
}

module.exports = new AsoleExpressService();
