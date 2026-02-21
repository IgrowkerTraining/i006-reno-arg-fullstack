const db = require('../config/db');

class User {
  
  constructor({ id_usuario, nombre, apellido, email, contrasena, id_rol, rol }) {
    this.id = id_usuario;
    this.name = nombre;
    this.lastName = apellido;
    this.email = email;
    this.password = contrasena;
    this.idRol = id_rol;
    this.rol = rol;
  }
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  static async create(userData) {
    const { name, lastName, email, password} = userData;
    const idMouckUp = 2;
    const sql = 'INSERT INTO USUARIO (nombre, apellido, email, contrasena, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING *';

    const data = await db.one(sql, [name , lastName, email, password, idMouckUp]);
    return new User(data);
}
static async getAllUsers() {
    const sql = `
      SELECT
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u.contrasena,
        u.id_rol,
        r.nombre AS rol
      FROM USUARIO u
      INNER JOIN ROL r ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario ASC;
    `;
    
    const data = await db.any(sql);
    
    return data.map(row => new User(row));
  }

 static async updateUser(id, userData) {
    const { name, lastName, email, idRol } = userData;
    const sql = `
      UPDATE USUARIO 
      SET nombre = $1, apellido = $2, email = $3, id_rol = $4
      WHERE id_usuario = $5
      RETURNING *
    `;
    
    const data = await db.one(sql, [name, lastName, email, idRol, id]);
    
    return User.findById(id); 
  }

  static async deleteUser(id) {
    const sql = 'DELETE FROM USUARIO WHERE id_usuario = $1;';
    const result = await db.result(sql, [id]);
    return result.rowCount > 0;
  }

  static async findById(id) {
    const sql = `
      SELECT u.*, r.nombre AS rol 
      FROM USUARIO u 
      INNER JOIN ROL r ON u.id_rol = r.id_rol 
      WHERE u.id_usuario = $1
    `;
    const data = await db.oneOrNone(sql, [id]);
    return data ? new User(data) : null;
  }
  static async findByEmail(email) {
    const sql = `
      SELECT
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u.contrasena,
        u.id_rol,
        r.nombre AS rol
      FROM USUARIO u
      INNER JOIN ROL r ON u.id_rol = r.id_rol
      WHERE u.email = $1;
    `;
    
    const data = await db.oneOrNone(sql, [email]);
    
    return data ? new User(data) : null;
  }
}

module.exports = User;
