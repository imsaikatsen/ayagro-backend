// services/auth.service.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/apiError');
const OTP = require('../models/otp.model');
const { generateOtp, getExpiry } = require('../utils/otp.util');
const { sendOtpToEmail, sendOtpToPhone } = require('../utils/otpSender');

class AuthService {
  async registerUser(userData) {
    const { email, password, role } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userToCreate = {
      ...userData,
      password: hashedPassword,
      role: role || 'customer',
    };

    const createdUser = await userRepository.create(userToCreate);

    const { password: _, ...safeUser } = createdUser.toObject();
    return safeUser;
  }

  // async loginUser(email, password) {
  //   const user = await userRepository.findByEmail(email);
  //   if (!user) {
  //     throw new ApiError(401, 'Invalid email or password');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) {
  //     throw new ApiError(401, 'Invalid email or password');
  //   }

  //   const payload = {
  //     id: user._id,
  //     email: user.email,
  //     role: user.role,
  //   };

  //   const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //     expiresIn: '7d',
  //   });

  //   const { password: _, ...safeUser } = user.toObject();

  //   return {
  //     token,
  //     user: {
  //       id: safeUser._id,
  //       email: safeUser.email,
  //       role: safeUser.role,
  //       firstName: safeUser.firstName,
  //       lastName: safeUser.lastName,
  //       phone: safeUser.phone,
  //     },
  //   };
  // }

  // ✅ Admin Login with email or phone + password
  async adminLogin(identifier, password) {
    const user = await userRepository.findByEmailOrPhone(identifier);
    if (!user || user.role !== 'admin') {
      throw new ApiError(403, 'Only admin can login here');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user.toObject();

    return {
      token,
      user: {
        id: safeUser._id,
        email: safeUser.email,
        role: safeUser.role,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        phone: safeUser.phone,
      },
    };
  }

  async getAllUsers() {
    const users = await userRepository.findAll();

    return users.map((user) => {
      const fromUser = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const fromProfile = `${user.profile?.personalInfo?.firstName || ''} ${
        user.profile?.personalInfo?.lastName || ''
      }`.trim();

      return {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        fullName: fromUser || fromProfile || 'N/A',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  }

  async updateUserById(userId, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await userRepository.updateById(userId, updateData);

    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    return updatedUser;
  }

  async deleteUserById(userId) {
    const deletedUser = await userRepository.deleteById(userId);
    if (!deletedUser) {
      throw new ApiError(404, 'User not found');
    }
    return;
  }

  async requestOtp(identifier) {
    let user;

    const isEmail = identifier.includes('@');

    if (isEmail) {
      user = await userRepository.findByEmail(identifier);
    } else {
      user = await userRepository.findByPhone(identifier);
    }

    // Auto-create customer if not found
    if (!user) {
      const userData = {
        role: 'customer',
        isVerified: false,
        email: isEmail ? identifier : '',
        phone: !isEmail ? identifier : '',
      };

      user = await userRepository.create(userData);
    }

    // Generate OTP
    const otpCode = generateOtp();
    const expiresAt = getExpiry(5); // 5 minutes

    // Save OTP in DB
    await OTP.create({
      userId: user._id,
      code: otpCode,
      expiresAt,
    });

    // Send OTP
    if (isEmail) {
      await sendOtpToEmail(user.email, otpCode);
    } else {
      await sendOtpToPhone(user.phone, otpCode);
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(identifier, code) {
    if (!identifier || !code) {
      throw new ApiError(400, 'Identifier and code are required');
    }

    const isEmail = identifier.includes('@');

    const user = isEmail
      ? await userRepository.findByEmail(identifier)
      : await userRepository.findByPhone(identifier);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const otpRecord = await OTP.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });

    if (
      !otpRecord ||
      otpRecord.code !== code ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new ApiError(401, 'Invalid or expired OTP');
    }

    // Optional: delete the used OTP
    await OTP.deleteMany({ userId: user._id });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async resendOtp(identifier) {
    if (!identifier) throw new ApiError(400, 'Identifier is required');
    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await userRepository.findByEmail(identifier)
      : await userRepository.findByPhone(identifier);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const latestOtp = await OTP.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });

    if (latestOtp) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (latestOtp.createdAt > oneMinuteAgo) {
        throw new ApiError(429, 'Otp was recently sent. Please wait a minute');
      }
    }

    //Genarate new OTP
    const newCode = generateOtp();
    const expiresAt = getExpiry(5); // 5 minutes
    await OTP.create({
      userId: user._id,
      code: newCode,
      expiresAt,
    });

    if (isEmail) {
      await sendOtpToEmail(user.email, newCode);
    } else {
      await sendOtpToPhone(user.phone, newCode);
    }

    return { message: 'OTP resent successfully' };
  }
}

module.exports = new AuthService();
