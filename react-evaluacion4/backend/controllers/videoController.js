const Video = require('../models/videoModel');

// Obtener todos los videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener videos' });
  }
};

// Crear un video
exports.createVideo = async (req, res) => {
  try {
    const { name, format, duration, size, file, audioTracks, subtitles } = req.body;
    // Validaciones mínimas
    if (!audioTracks || audioTracks.length < 2) {
      return res.status(400).json({ error: 'Debe tener al menos 2 pistas de audio' });
    }
    if (!subtitles || subtitles.length < 2) {
      return res.status(400).json({ error: 'Debe tener al menos 2 subtítulos' });
    }
    if (!subtitles.every(s => s.file.endsWith('.vtt'))) {
      return res.status(400).json({ error: 'Los subtítulos deben ser archivos .vtt' });
    }
    // Validar duración igual
    if (!audioTracks.every(a => Number(a.duration) === Number(duration))) {
      return res.status(400).json({ error: 'Todas las pistas de audio deben tener la misma duración que el video' });
    }
    if (!subtitles.every(s => Number(s.duration) === Number(duration))) {
      return res.status(400).json({ error: 'Todos los subtítulos deben tener la misma duración que el video' });
    }
    const video = new Video({ name, format, duration, size, file, audioTracks, subtitles });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear video', details: err.message });
  }
};

// Actualizar un video
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, format, duration, size, file, audioTracks, subtitles } = req.body;
    if (audioTracks && audioTracks.length < 2) {
      return res.status(400).json({ error: 'Debe tener al menos 2 pistas de audio' });
    }
    if (subtitles && subtitles.length < 2) {
      return res.status(400).json({ error: 'Debe tener al menos 2 subtítulos' });
    }
    if (subtitles && !subtitles.every(s => s.file.endsWith('.vtt'))) {
      return res.status(400).json({ error: 'Los subtítulos deben ser archivos .vtt' });
    }
    if (audioTracks && !audioTracks.every(a => Number(a.duration) === Number(duration))) {
      return res.status(400).json({ error: 'Todas las pistas de audio deben tener la misma duración que el video' });
    }
    if (subtitles && !subtitles.every(s => Number(s.duration) === Number(duration))) {
      return res.status(400).json({ error: 'Todos los subtítulos deben tener la misma duración que el video' });
    }
    const video = await Video.findByIdAndUpdate(id, { name, format, duration, size, file, audioTracks, subtitles }, { new: true });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar video', details: err.message });
  }
};

// Eliminar un video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    res.json({ message: 'Video eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar video' });
  }
};