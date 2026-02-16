const userService = require('../services/userService');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({ message: error.message });
      }
      return next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ message: error.message });
      }
      return next(error);
    }
  }

  async getAllUsers(_req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.findById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      return next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      return next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      return next(error);
    }
  }
}

module.exports = new UserController();