// controllers/auth.controller.js
const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      console.log('Received req.body:', req.body);

      const newUser = await authService.registerUser(req.body);
      res.status(201).json({
        message: 'User registered successfully!',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      res.status(200).json({
        message: 'Login successful!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserList(req, res, next) {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json({
        message: 'User list fetched successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedUser = await authService.updateUserById(userId, req.body);
      res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      await authService.deleteUserById(userId);
      res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
