const TamaniosFuente = require('../models/tamaniosFuenteModel');

exports.getTamaniosFuente = async (req, res) => {
    try {
        const tamanios = await TamaniosFuente.get();
        res.json(tamanios || { titulo: 24, subtitulo: 18, texto: 14 }); // Valores por defecto
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTamaniosFuente = async (req, res) => {
    try {
        await TamaniosFuente.update(req.body);
        res.json({ message: 'Tamaños de fuente actualizados correctamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};