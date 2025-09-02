import React, { useState, useRef, useEffect } from 'react';
import './VideoViewer.css';

const VideoViewer = ({ video, onClose }) => {
  const [currentAudioTrack, setCurrentAudioTrack] = useState('original');
  const [currentSubtitle, setCurrentSubtitle] = useState('disabled');
  // Prefiere pistas del objeto video; si no existen, usa valores de ejemplo
  const [audioTracks, setAudioTracks] = useState(() => {
    const tracks = Array.isArray(video.audioTracks) ? video.audioTracks : [];
    const base = [{ id: 'original', name: 'Audio Original', language: 'es' }];
    return base.concat(tracks);
  });
  const [subtitles, setSubtitles] = useState(() => {
    const subs = Array.isArray(video.subtitles) ? video.subtitles : [];
    return [{ id: 'disabled', name: 'Desactivado', language: 'none' }].concat(
      subs.map(s => ({ id: s.id || s.language || 'custom', name: s.name || (s.language === 'es' ? 'Español' : s.language === 'en' ? 'Inglés' : 'Subtítulo'), language: s.language, file: s.file }))
    );
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current.duration);
        // Si no se proveyeron subtítulos desde props, intenta leer los textTracks del video
        const tracks = videoRef.current.textTracks;
        if (tracks && tracks.length > 0) {
          const found = [{ id: 'disabled', name: 'Desactivado', language: 'none' }];
          for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i];
            const lang = t.language || t.label;
            found.push({
              id: lang || `track_${i}`,
              name: lang === 'es' ? 'Español' : lang === 'en' ? 'Inglés' : (t.label || `Subtítulo ${i+1}`),
              language: t.language,
            });
          }
          setSubtitles(found);
        }
      });
      
      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current.currentTime);
        // Mantener audio externo sincronizado
        if (audioRef.current && currentAudioTrack !== 'original') {
          const diff = Math.abs((audioRef.current.currentTime || 0) - videoRef.current.currentTime);
          if (diff > 0.3) {
            audioRef.current.currentTime = videoRef.current.currentTime;
          }
        }
      });
      
      videoRef.current.addEventListener('play', () => {
        setIsPlaying(true);
        if (audioRef.current && currentAudioTrack !== 'original' && audioRef.current.src) {
          audioRef.current.play().catch(() => {});
        }
      });
      
      videoRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
      });
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleAudioTrackChange = (trackId) => {
    setCurrentAudioTrack(trackId);
    const selected = audioTracks.find(t => t.id === trackId);
    if (!videoRef.current) return;
    // Si es la pista original (del video), desmutear el video y pausar audio externo
    if (!selected || trackId === 'original') {
      videoRef.current.muted = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
      return;
    }
    // Usar pista de audio externa sincronizada
    videoRef.current.muted = true;
    if (audioRef.current && selected.file) {
      const wasPlaying = !videoRef.current.paused;
      audioRef.current.src = selected.file;
      audioRef.current.currentTime = videoRef.current.currentTime || 0;
      audioRef.current.playbackRate = videoRef.current.playbackRate || 1;
      if (wasPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleSubtitleChange = (subtitleId) => {
    setCurrentSubtitle(subtitleId);
    const tracks = videoRef.current ? videoRef.current.textTracks : [];
    if (!tracks) return;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      track.mode = 'disabled';
      // Habilita el que coincida por label o srclang con el id
      if (subtitleId !== 'disabled' && (track.label === subtitleId || track.language === subtitleId)) {
        track.mode = 'showing';
      }
    }
  };

  const addAudioTrack = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const newTrack = {
          id: `track_${Date.now()}`,
          name: file.name,
          language: 'es',
          file: URL.createObjectURL(file)
        };
        setAudioTracks(prev => [...prev, newTrack]);
      }
    };
    input.click();
  };

  const removeAudioTrack = (trackId) => {
    setAudioTracks(prev => prev.filter(track => track.id !== trackId));
  };

  return (
    <div className="video-viewer-modal">
      <div className="video-viewer-content">
        <div className="video-viewer-header">
          <h3>Reproductor de Video</h3>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>

        <div className="video-viewer-body">
          <div className="video-container">
            <div className="video-title">
              <h4>{video.name || 'Mar en calma al atardecer'}</h4>
            </div>
            
            <div className="video-player">
              <video 
                ref={videoRef}
                src={video.file} 
                className="main-video"
                muted={currentAudioTrack !== 'original'}
                controls={false}
              >
                {subtitles
                  .filter(s => s.id !== 'disabled' && s.file)
                  .map(s => (
                    <track
                      key={s.id}
                      kind="subtitles"
                      srcLang={s.language || s.id}
                      label={s.name || s.id}
                      src={s.file}
                    />
                  ))}
              </video>
              {/* audio externo para pistas alternativas */}
              <audio ref={audioRef} />
              
              {/* Overlay de controles */}
              <div className="video-overlay">
                <div className="play-button" onClick={handlePlayPause}>
                  <i className={`bi ${isPlaying ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                </div>
              </div>
            </div>

            {/* Controles de audio y subtítulos */}
            <div className="media-controls">
              <div className="control-group">
                <label>Pista de Audio:</label>
                <select 
                  value={currentAudioTrack} 
                  onChange={(e) => handleAudioTrackChange(e.target.value)}
                  className="form-select"
                >
                  {audioTracks.map(track => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={addAudioTrack}
                >
                  + Añadir pista de audio
                </button>
              </div>

              <div className="control-group">
                <label>Subtítulos:</label>
                <select 
                  value={currentSubtitle} 
                  onChange={(e) => handleSubtitleChange(e.target.value)}
                  className="form-select"
                >
                  {subtitles.map(subtitle => (
                    <option key={subtitle.id} value={subtitle.id}>
                      {subtitle.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subtítulos simulados */}
            {currentSubtitle !== 'disabled' && (
              <div className="subtitles-container">
                <div className="subtitles-text">
                  <p>El cielo se llena de hermosos colores.</p>
                  <p>El sol se está poniendo en un mar tranquilo.</p>
                </div>
              </div>
            )}

            {/* Barra de progreso */}
            <div className="progress-container">
              <div className="progress-bar" onClick={handleSeek}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
                <div 
                  className="progress-handle" 
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controles de velocidad */}
            <div className="speed-controls">
              <label>Velocidad:</label>
              <div className="speed-buttons">
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    className={`btn btn-sm ${playbackSpeed === speed ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSpeedChange(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de pistas de audio */}
            <div className="audio-tracks-list">
              <h6>Pistas de Audio Disponibles:</h6>
              <div className="tracks-container">
                {audioTracks.map(track => (
                  <div key={track.id} className="track-item">
                    <div className="track-info">
                      <span className="track-name">{track.name}</span>
                      <span className="track-language">({track.language})</span>
                    </div>
                    <div className="track-actions">
                      <button 
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleAudioTrackChange(track.id)}
                      >
                        <i className="bi bi-play"></i>
                      </button>
                      {track.id !== 'original' && track.id !== 'original2' && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeAudioTrack(track.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="video-viewer-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn-primary">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;
