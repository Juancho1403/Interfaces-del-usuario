const mongoose = require('mongoose');

const imagenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  format: { type: String, required: true },
  size: {
    type: Number,
    required: true,
    validate: {
      validator: v => v <= 4,
      message: 'El tamaño máximo es 4MB'
    }
  },
  dimensions: {
    type: String,
    required: true,
    validate: {
      validator: v => {
        const [w, h] = v.split('x').map(Number);
        return w >= 1000 && h >= 1000;
      },
      message: 'Las dimensiones mínimas son 1000x1000px'
    }
  },
  file: { type: String, required: true }, // Ruta o nombre del archivo
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Imagen', imagenSchema);