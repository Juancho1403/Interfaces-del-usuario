const Video = require('../models/videoModel');

// Obtener todos los videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    // Parsear los campos JSON
    const parsedVideos = videos.map(video => ({
      ...video,
      audioTracks: JSON.parse(video.audioTracks),
      subtitles: JSON.parse(video.subtitles)
    }));
    res.json(parsedVideos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener videos' });
  }
};

// Crear un video

// Requiere: npm install fluent-ffmpeg
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.createVideo = async (req, res) => {
  try {
    // Archivos subidos: req.files = { video: [File], audios: [File, File, ...] }
    const videoFile = req.files['video']?.[0];
    const audioFiles = req.files['audios'] || [];
    if (!videoFile || audioFiles.length < 2) {
      return res.status(400).json({ error: 'Debes subir un video y al menos dos audios (español e inglés)' });
    }

    // Multiplexar con FFmpeg
    const outputPath = path.join(__dirname, '../uploads', 'muxed-' + Date.now() + '.mp4');
    let command = ffmpeg(videoFile.path);
    audioFiles.forEach(audio => {
      command = command.input(audio.path);
    });
    command.outputOptions([
      '-map 0:v:0', // video
      '-map 1:a:0', // primer audio
      '-map 2:a:0', // segundo audio
      '-c:v copy',
      '-c:a aac',
      '-metadata:s:a:0 language=es',
      '-metadata:s:a:1 language=en'
    ]);
    command.save(outputPath)
      .on('end', async () => {
        // Aquí puedes guardar en la BD si lo necesitas
        res.status(201).json({ file: outputPath, message: 'Video multiplexado correctamente' });
        // Opcional: eliminar archivos temporales
        try {
          fs.unlinkSync(videoFile.path);
          audioFiles.forEach(a => fs.unlinkSync(a.path));
        } catch {}
      })
      .on('error', err => {
        res.status(500).json({ error: 'Error al multiplexar video', details: err.message });
      });
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
    const video = await Video.findByIdAndUpdate(id, { name, format, duration, size, file, audioTracks, subtitles });
    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar video', details: err.message });
  }
};

// Eliminar un video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }
    res.json({ message: 'Video eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar video' });
  }
};