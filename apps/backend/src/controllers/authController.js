const UserService = require('../services/userService');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        const error = new Error('All fields are required');
        error.status = 400;
        return next(error);
      }

      const newUser = await UserService.create(req.body);
      if (!newUser) {
        const error = new Error('Email already in use');
        error.status = 409;
        return next(error);
      }

      return res.status(201).json(newUser.toJSON());
    } catch (error) {
      return next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const error = new Error('Email and password are required');
        error.status = 400;
        return next(error);
      }

      const result = await UserService.loginUser(email, password);
      if (!result) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        return next(error);
      }

      return res.status(200).json({
        ...result,
        message: 'Login successful'
      });
    } catch (error) {
      return next(error);     
    }
}
}
module.exports = AuthController;
