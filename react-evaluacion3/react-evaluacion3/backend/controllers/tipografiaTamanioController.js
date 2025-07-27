const TipografiaTamanio = require('../models/tipografiaTamanioModel');

exports.getAll = async (req, res) => {
  try {
    const configs = await TipografiaTamanio.getAll();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await TipografiaTamanio.create(req.body);
    res.status(201).json({ id, message: 'Configuración guardada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'No se pudo guardar la configuración', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    await TipografiaTamanio.update(req.params.id, req.body);
    res.json({ message: 'Configuración actualizada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'No se pudo actualizar', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await TipografiaTamanio.delete(req.params.id);
    res.json({ message: 'Configuración eliminada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'No se pudo eliminar', error: error.message });
  }
}; 