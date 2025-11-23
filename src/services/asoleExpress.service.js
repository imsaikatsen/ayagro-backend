const repo = require('../repositories/asoleExpress.repository');
const { generateOtp, getExpiry } = require('../utils/otpSender');
const sendSMS = require('../utils/sendSMS');
const ApiError = require('../utils/apiError');
const redisClient = require('../config/redis'); // ✔ Correct import

class AsoleExpressService {
  // CREATE JOB (store in Redis temporarily)
  async create(data) {
    const otp = generateOtp();
    const otpExpiresAt = getExpiry(5);
    const tempId = `asole_job_${data.phone}`;

    await redisClient.set(
      tempId,
      JSON.stringify({ ...data, otp, otpExpiresAt }),
      'EX',
      300 // 5 min expiry
    );

    await sendSMS(
      created.phone,
      `Your OTP for Asol Express verification is ${otp}`
    );

    return { message: 'OTP sent successfully', tempId };
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

  // VERIFY OTP & THEN SAVE TO DATABASE
  async verifyOtp(tempId, code) {
    const tempData = await redisClient.get(tempId);
    if (!tempData) throw new ApiError(400, 'Session expired');

    const parsed = JSON.parse(tempData);
    if (parsed.otp !== code) throw new ApiError(400, 'Invalid OTP');
    if (new Date(parsed.otpExpiresAt) < new Date())
      throw new ApiError(400, 'OTP expired');

    const finalJob = await repo.create({
      ...parsed,
      status: 'assigned',
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    });

    await redisClient.del(tempId);

    return {
      message: 'Phone verified successfully, job confirmed',
      data: finalJob,
    };
  }

  // OPTIONAL: Resend OTP if needed (uses DB)
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
