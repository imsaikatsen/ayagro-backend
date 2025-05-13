// services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/apiError');

class AuthService {
  async registerUser(userData) {
    const { email, password, role } = userData;

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign default role if not provided
    const userToCreate = {
      ...userData,
      password: hashedPassword,
      role: role || 'customer',
    };

    // Create user
    const createdUser = await userRepository.create(userToCreate);

    // Remove sensitive info
    const { password: _, ...safeUser } = createdUser.toObject();

    return safeUser;
  }

  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Prepare JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

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
    return await userRepository.findAll();
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
}

module.exports = new AuthService();
