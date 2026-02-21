const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {

  static async createUser(userData) {
    const { name, lastName, email, password, idRol } = userData;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return null;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ name, lastName, email, password: hashedPassword, idRol });
    return newUser;
}

static async loginUser(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.idRol }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
    ); 
    return { 
        user: {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            idRol: user.idRol
        }, 
        token 
    };
}

  static async getAllUsers() {
    const users = await User.getAllUsers();
    return users.map(user => user.toJSON());
  }
  static async findById(id) {
    const user = await User.findById(id);
    if (!user) {
      return null;
    }
    return user.toJSON();
  }

  static async updateUser(id, userData) {
    if(userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    const updatedUser = await User.updateUser(id, userData);
    return updatedUser ? updatedUser.toJSON() : null;
  }
  static async deleteUser(id) {
    const deleted = await User.deleteUser(id);
    return deleted;
  }
}
module.exports =  UserService;
