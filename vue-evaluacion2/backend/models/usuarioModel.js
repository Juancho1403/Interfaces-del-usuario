const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const Usuarios = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM usuarios_login');
    return rows;
  },

  async create(user) {
    const {
      email, password, role, estado,
      firstName, lastName, age, gender, birthDate, maidenName, username, phone,
      address_address, address_city, address_state, address_postalCode, address_country,
      university, company_name, company_title, company_department, bloodGroup
    } = user;
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO usuarios_login (
        email, password, role, estado,
        firstName, lastName, age, gender, birthDate, maidenName, username, phone,
        address_address, address_city, address_state, address_postalCode, address_country,
        university, company_name, company_title, company_department, bloodGroup
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email, hash, role || 'user', estado || 'activo',
        firstName, lastName, age, gender, birthDate, maidenName, username, phone,
        address_address, address_city, address_state, address_postalCode, address_country,
        university, company_name, company_title, company_department, bloodGroup
      ]
    );
    return result.insertId;
  },

  async getByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios_login WHERE email = ?', [email]);
    return rows[0];
  },

  async createRegister({ email, password }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO usuarios_login (email, password, role, estado)
       VALUES (?, ?, 'user', 'activo')`,
      [email, hash]
    );
    return result.insertId;
  },

  async validatePassword(email, password) {
    const user = await this.getByEmail(email);
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  },

  async updateProfile(id, data) {
    // Solo actualiza email y password si se proveen
    const fields = [];
    const values = [];
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      fields.push('password = ?');
      values.push(hash);
    }
    if (fields.length === 0) return;
    values.push(id);
    await pool.query(
      `UPDATE usuarios_login SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM usuarios_login WHERE id = ?', [id]);
    return rows[0];
  },

  async getAllBasic() {
    const [rows] = await pool.query('SELECT id, email, role, estado FROM usuarios_login');
    return rows;
  },

  async disableUser(id) {
    await pool.query('UPDATE usuarios_login SET estado = "deshabilitado" WHERE id = ?', [id]);
  },

  async enableUser(id) {
    await pool.query('UPDATE usuarios_login SET estado = "activo" WHERE id = ?', [id]);
  },

  async isActive(email) {
    const user = await this.getByEmail(email);
    return user && user.estado === 'activo';
  },

  async updateById(id, data) {
    // Actualiza todos los campos del usuario
    const fields = [];
    const values = [];
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      fields.push('password = ?'); values.push(hash);
    }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }
    if (data.estado) { fields.push('estado = ?'); values.push(data.estado); }
    if (data.firstName) { fields.push('firstName = ?'); values.push(data.firstName); }
    if (data.lastName) { fields.push('lastName = ?'); values.push(data.lastName); }
    if (data.age) { fields.push('age = ?'); values.push(data.age); }
    if (data.gender) { fields.push('gender = ?'); values.push(data.gender); }
    if (data.birthDate) { fields.push('birthDate = ?'); values.push(data.birthDate); }
    if (data.maidenName) { fields.push('maidenName = ?'); values.push(data.maidenName); }
    if (data.username) { fields.push('username = ?'); values.push(data.username); }
    if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.address_address) { fields.push('address_address = ?'); values.push(data.address_address); }
    if (data.address_city) { fields.push('address_city = ?'); values.push(data.address_city); }
    if (data.address_state) { fields.push('address_state = ?'); values.push(data.address_state); }
    if (data.address_postalCode) { fields.push('address_postalCode = ?'); values.push(data.address_postalCode); }
    if (data.address_country) { fields.push('address_country = ?'); values.push(data.address_country); }
    if (data.university) { fields.push('university = ?'); values.push(data.university); }
    if (data.company_name) { fields.push('company_name = ?'); values.push(data.company_name); }
    if (data.company_title) { fields.push('company_title = ?'); values.push(data.company_title); }
    if (data.company_department) { fields.push('company_department = ?'); values.push(data.company_department); }
    if (data.bloodGroup) { fields.push('bloodGroup = ?'); values.push(data.bloodGroup); }
    if (fields.length === 0) return;
    values.push(id);
    await pool.query(
      `UPDATE usuarios_login SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};

module.exports = {
  Usuarios
}; 