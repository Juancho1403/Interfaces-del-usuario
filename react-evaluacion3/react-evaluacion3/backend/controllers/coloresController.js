const Colores = require('../models/coloresModel');

exports.getAllColores = async (req, res) => {
    try {
        const colores = await Colores.getAll();
        res.json(colores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getColorById = async (req, res) => {
    try {
        const color = await Colores.getById(req.params.id);
        if (!color) {
            return res.status(404).json({ message: 'Paleta de colores no encontrada' });
        }
        res.json(color);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createColor = async (req, res) => {
    try {
        const newColorId = await Colores.create(req.body);
        res.status(201).json({ id: newColorId, ...req.body });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateColor = async (req, res) => {
    try {
        const affectedRows = await Colores.update(req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Paleta de colores no encontrada' });
        }
        res.json({ message: 'Paleta de colores actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteColor = async (req, res) => {
    try {
        const affectedRows = await Colores.delete(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Paleta de colores no encontrada' });
        }
        res.json({ message: 'Paleta de colores eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};