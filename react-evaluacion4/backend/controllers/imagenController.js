const Imagen = require('../models/imagenModel');

// Obtener todas las imágenes
exports.getImagenes = async (req, res) => {
  try {
    const imagenes = await Imagen.find();
    res.json(imagenes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
};

// Crear una imagen
exports.createImagen = async (req, res) => {
  try {
    const { name, format, size, dimensions, file } = req.body;
    // Validaciones
    if (Number(size) > 4) {
      return res.status(400).json({ error: 'El tamaño máximo es 4MB' });
    }
    const [w, h] = dimensions.split('x').map(Number);
    if (w < 1000 || h < 1000) {
      return res.status(400).json({ error: 'Las dimensiones mínimas son 1000x1000px' });
    }
    const imagen = new Imagen({ name, format, size, dimensions, file });
    await imagen.save();
    res.status(201).json(imagen);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear imagen', details: err.message });
  }
};

// Actualizar una imagen
exports.updateImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, format, size, dimensions, file } = req.body;
    if (size && Number(size) > 4) {
      return res.status(400).json({ error: 'El tamaño máximo es 4MB' });
    }
    if (dimensions) {
      const [w, h] = dimensions.split('x').map(Number);
      if (w < 1000 || h < 1000) {
        return res.status(400).json({ error: 'Las dimensiones mínimas son 1000x1000px' });
      }
    }
    const imagen = await Imagen.findByIdAndUpdate(id, { name, format, size, dimensions, file }, { new: true });
    res.json(imagen);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar imagen', details: err.message });
  }
};

// Eliminar una imagen
exports.deleteImagen = async (req, res) => {
  try {
    const { id } = req.params;
    await Imagen.findByIdAndDelete(id);
    res.json({ message: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};