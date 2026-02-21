const UserService = require('../services/userService');

class UserController {
  static async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      if (!user) {
        const error = new Error('Email already in use');
        error.status = 409;
        return next(error);
      }
      return res.status(201).json(user.toJSON());
    } catch (error) {
      return next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.loginUser(email, password);
      if (!result) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        return next(error);
      }
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllUsers(_req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await UserService.findById(req.params.id);
      if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        return next(error);
      }
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }

  }

  static async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        const error = new Error('User not found');
        error.status = 404;
        return next(error);
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteUser(req, res, next) {
  try {
    const deleted = await UserService.deleteUser(req.params.id);
    if (!deleted) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
}
}

module.exports = UserController;