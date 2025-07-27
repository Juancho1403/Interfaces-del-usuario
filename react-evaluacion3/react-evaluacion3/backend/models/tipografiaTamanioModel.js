const pool = require('../config/db');

const TipografiaTamanio = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM tipografia_tamanio');
    return rows;
  },
  async create(data) {
    const { nombre, fuente_titulo, fuente_texto, tam_titulo, tam_subtitulo, tam_texto } = data;
    const [result] = await pool.query(
      `INSERT INTO tipografia_tamanio (nombre, fuente_titulo, fuente_texto, tam_titulo, tam_subtitulo, tam_texto) VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, fuente_titulo, fuente_texto, tam_titulo, tam_subtitulo, tam_texto]
    );
    return result.insertId;
  },
  async update(id, data) {
    const { nombre, fuente_titulo, fuente_texto, tam_titulo, tam_subtitulo, tam_texto } = data;
    await pool.query(
      `UPDATE tipografia_tamanio SET nombre=?, fuente_titulo=?, fuente_texto=?, tam_titulo=?, tam_subtitulo=?, tam_texto=? WHERE id=?`,
      [nombre, fuente_titulo, fuente_texto, tam_titulo, tam_subtitulo, tam_texto, id]
    );
  },
  async delete(id) {
    await pool.query('DELETE FROM tipografia_tamanio WHERE id=?', [id]);
  }
};

module.exports = TipografiaTamanio; 