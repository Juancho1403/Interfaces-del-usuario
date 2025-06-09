const Tipografias = require('../models/tipografiasModel');
const fs = require('fs');
const path = require('path');

exports.getAllTipografias = async (req, res) => {
    try {
        const tipografias = await Tipografias.getAll();
        res.json(tipografias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTipografiaById = async (req, res) => {
    try {
        const tipografia = await Tipografias.getById(req.params.id);
        if (!tipografia) {
            return res.status(404).json({ message: 'Tipografía no encontrada' });
        }
        res.json(tipografia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTipografiaFile = async (req, res) => {
    try {
        const { id, type } = req.params;
        const fileData = await Tipografias.getFileById(id, type);
        
        if (!fileData) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        const fileBuffer = fileData[`archivo_${type}`];
        const fileName = fileData[`nombre_archivo_${type}`];

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(fileBuffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTipografia = async (req, res) => {
    try {
        if (!req.files || !req.files.archivo_titulo) {
            return res.status(400).json({ message: 'Se requiere al menos el archivo para el título' });
        }

        const tipografiaData = {
            nombre: req.body.nombre,
            archivo_titulo: req.files.archivo_titulo[0].buffer,
            nombre_archivo_titulo: req.files.archivo_titulo[0].originalname,
            archivo_texto: req.files.archivo_texto ? req.files.archivo_texto[0].buffer : null,
            nombre_archivo_texto: req.files.archivo_texto ? req.files.archivo_texto[0].originalname : null
        };

        const newTipografiaId = await Tipografias.create(tipografiaData);
        res.status(201).json({ id: newTipografiaId, message: 'Tipografía creada correctamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTipografia = async (req, res) => {
    try {
        const affectedRows = await Tipografias.delete(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Tipografía no encontrada' });
        }
        res.json({ message: 'Tipografía eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};