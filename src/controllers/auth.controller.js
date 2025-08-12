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

  async adminLogin(req, res, next) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.adminLogin(identifier, password);
      res.status(200).json({
        message: 'Admin login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // async getUserList(req, res, next) {
  //   try {
  //     const users = await authService.getAllUsers();
  //     res.status(200).json({
  //       message: 'User list fetched successfully',
  //       data: users,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getUserList(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const result = await authService.getAllUsers({ page, limit, search });

      res.status(200).json({
        message: 'User list fetched successfully',
        data: result.users,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
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

  async requestOtp(req, res, next) {
    try {
      const { identifier } = req.body;

      if (!identifier) {
        return res
          .status(400)
          .json({ success: false, message: 'Email or phone is required' });
      }

      const result = await authService.requestOtp(identifier);

      return res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { identifier, code } = req.body;
      const result = await authService.verifyOtp(identifier, code);
      res.status(200).json({
        message: 'OTP verified successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const { identifier } = req.body;

      if (!identifier) {
        return res
          .status(400)
          .json({ success: false, message: 'Email or phone is required' });
      }

      const result = await authService.resendOtp(identifier);

      return res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  }

  async updateDeviceToken(req, res, next) {
    try {
      await authService.updateDeviceToken(req.user.id, req.body.deviceToken);
      res.status(200).json({ message: 'Device token updated' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
