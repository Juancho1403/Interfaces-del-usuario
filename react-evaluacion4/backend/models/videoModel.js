const mongoose = require('mongoose');

const audioTrackSchema = new mongoose.Schema({
  lang: { type: String, required: true },
  file: { type: String, required: true }, // Ruta o nombre del archivo
  duration: { type: Number, required: true }, // En segundos
});

const subtitleSchema = new mongoose.Schema({
  lang: { type: String, required: true },
  file: { type: String, required: true }, // Ruta o nombre del archivo .vtt
  duration: { type: Number, required: true }, // En segundos
});

const videoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  format: { type: String, required: true },
  duration: { type: Number, required: true }, // En segundos
  size: { type: Number, required: true }, // En MB
  file: { type: String, required: true }, // Ruta o nombre del archivo de video
  audioTracks: {
    type: [audioTrackSchema],
    validate: [arr => arr.length >= 2, 'Debe tener al menos 2 pistas de audio']
  },
  subtitles: {
    type: [subtitleSchema],
    validate: [arr => arr.length >= 2, 'Debe tener al menos 2 subtítulos']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);