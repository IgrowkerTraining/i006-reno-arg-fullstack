const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {

  async createUser(userData) {
    const { name, lastName, email, password, idRol } = userData;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ name, lastName, email, password: hashedPassword, idRol });
    return newUser;
}

async loginUser(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
    return { user: user.toJSON(), token };
  }

  async getAllUsers() {
    const users = await User.getAllUsers();
    return users.map(user => user.toJSON());
  }
  async findById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  async updateUser(id, userData) {
    if(userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    const updatedUser = await User.updateUser(id, userData);
    return updatedUser.toJSON();
  }
  async deleteUser(id) {
    await User.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
module.exports = new UserService();
