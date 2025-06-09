const pool = require('../config/db');

const Colores = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM colores');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM colores WHERE id = ?', [id]);
        return rows[0];
    },

    async create(colorData) {
        const { color_primario, color_secundario, color_terciario, color_texto, color_fondo, nombre_paleta } = colorData;
        const [result] = await pool.query(
            'INSERT INTO colores (color_primario, color_secundario, color_terciario, color_texto, color_fondo, nombre_paleta) VALUES (?, ?, ?, ?, ?, ?)',
            [color_primario, color_secundario, color_terciario, color_texto, color_fondo, nombre_paleta]
        );
        return result.insertId;
    },

    async update(id, colorData) {
        const { color_primario, color_secundario, color_terciario, color_texto, color_fondo, nombre_paleta } = colorData;
        const [result] = await pool.query(
            'UPDATE colores SET color_primario = ?, color_secundario = ?, color_terciario = ?, color_texto = ?, color_fondo = ?, nombre_paleta = ? WHERE id = ?',
            [color_primario, color_secundario, color_terciario, color_texto, color_fondo, nombre_paleta, id]
        );
        return result.affectedRows;
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM colores WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Colores;