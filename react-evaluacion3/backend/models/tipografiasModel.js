const pool = require('../config/db');

const Tipografias = {
    async getAll() {
        const [rows] = await pool.query('SELECT id, nombre, nombre_archivo_titulo, nombre_archivo_texto, creado_en FROM tipografias');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT id, nombre, nombre_archivo_titulo, nombre_archivo_texto, creado_en FROM tipografias WHERE id = ?', [id]);
        return rows[0];
    },

    async getFileById(id, type) {
        const column = type === 'titulo' ? 'archivo_titulo' : 'archivo_texto';
        const [rows] = await pool.query(`SELECT ${column}, nombre_archivo_${type} FROM tipografias WHERE id = ?`, [id]);
        return rows[0];
    },

    async create(tipografiaData) {
        const { nombre, archivo_titulo, nombre_archivo_titulo, archivo_texto, nombre_archivo_texto } = tipografiaData;
        const [result] = await pool.query(
            'INSERT INTO tipografias (nombre, archivo_titulo, nombre_archivo_titulo, archivo_texto, nombre_archivo_texto) VALUES (?, ?, ?, ?, ?)',
            [nombre, archivo_titulo, nombre_archivo_titulo, archivo_texto, nombre_archivo_texto]
        );
        return result.insertId;
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM tipografias WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Tipografias;