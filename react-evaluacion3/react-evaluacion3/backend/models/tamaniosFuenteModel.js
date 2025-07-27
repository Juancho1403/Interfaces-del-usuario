const pool = require('../config/db');

const TamaniosFuente = {
    async get() {
        const [rows] = await pool.query('SELECT * FROM tamanios_fuente ORDER BY id DESC LIMIT 1');
        return rows[0];
    },

    async update(tamaniosData) {
        const { titulo, subtitulo, texto } = tamaniosData;
        // Eliminamos cualquier configuración previa
        await pool.query('DELETE FROM tamanios_fuente');
        
        const [result] = await pool.query(
            'INSERT INTO tamanios_fuente (titulo, subtitulo, texto) VALUES (?, ?, ?)',
            [titulo, subtitulo, texto]
        );
        return result.insertId;
    }
};

module.exports = TamaniosFuente;