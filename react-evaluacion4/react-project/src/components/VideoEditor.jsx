import React, { useState, useRef } from 'react';
import './VideoEditor.css';

const VideoEditor = ({ onVideoSave, onClose }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [subtitles, setSubtitles] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [videoName, setVideoName] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      
      // Obtener información del video
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
        setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
        
        setVideoInfo({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          extension: file.name.split('.').pop().toUpperCase(),
          type: file.type,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        });
      };
      video.src = videoUrl;
    }
  };

  const addSubtitle = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.srt,.vtt,.txt';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const newSubtitle = {
          id: `subtitle_${Date.now()}`,
          name: file.name,
          language: 'es',
          file: URL.createObjectURL(file)
        };
        setSubtitles(prev => [...prev, newSubtitle]);
      }
    };
    input.click();
  };

  const addAudioTrack = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const newTrack = {
          id: `audio_${Date.now()}`,
          name: file.name,
          language: 'es',
          file: URL.createObjectURL(file)
        };
        setAudioTracks(prev => [...prev, newTrack]);
      }
    };
    input.click();
  };

  const removeSubtitle = (id) => {
    setSubtitles(prev => prev.filter(sub => sub.id !== id));
  };

  const removeAudioTrack = (id) => {
    setAudioTracks(prev => prev.filter(track => track.id !== id));
  };

  const saveToCarousel = () => {
    if (selectedVideo && videoInfo && onVideoSave) {
      const finalVideoInfo = {
        ...videoInfo,
        name: videoName || videoInfo.name,
        subtitles: subtitles.map(s => ({ id: s.id, name: s.name || (s.language === 'es' ? 'Español' : s.language === 'en' ? 'Inglés' : s.name), language: s.language, file: s.file })),
        audioTracks: audioTracks.map(a => ({ id: a.id || a.language, name: a.name || (a.language === 'es' ? 'Español' : 'Inglés'), language: a.language, file: a.file }))
      };
      onVideoSave(selectedVideo, finalVideoInfo);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="video-editor-modal">
      <div className="video-editor-content">
        <div className="video-editor-header">
          <h3>Subir Nuevo Video</h3>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>

        <div className="video-editor-body">
          {!selectedVideo ? (
            <div className="upload-area">
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fas fa-upload me-2"></i>
                Seleccionar Video
              </button>
              <p className="text-muted mt-3">
                Formatos soportados: MP4, AVI, MOV, WMV, FLV
              </p>
            </div>
          ) : (
            <div className="editor-container">
              <div className="editor-main">
                <div className="video-container">
                  <video 
                    ref={videoRef}
                    src={selectedVideo} 
                    controls
                    className="preview-video"
                    style={{ width: '100%' }}
                  >
                    {subtitles.map((subtitle, idx) => (
                      <track
                        key={subtitle.id}
                        src={subtitle.file}
                        kind="subtitles"
                        srcLang={subtitle.language}
                        label={subtitle.language === 'es' ? 'Español' : subtitle.language === 'en' ? 'Inglés' : subtitle.language}
                        default={idx === 0}
                      />
                    ))}
                  </video>
                </div>
                
                <div className="editor-controls">
                  <div className="control-group">
                    <button className="btn btn-primary" onClick={saveToCarousel}>
                      <i className="fas fa-save"></i> Subir Video a Galería
                    </button>
                    <button className="btn btn-secondary" onClick={() => {
                      setSelectedVideo(null);
                      setVideoInfo(null);
                      setVideoDuration(0);
                      setVideoDimensions({ width: 0, height: 0 });
                      setSubtitles([]);
                      setAudioTracks([]);
                      setVideoName('');
                    }}>
                      <i className="fas fa-refresh"></i> Seleccionar Otro Video
                    </button>
                  </div>
                </div>
              </div>

              <div className="video-info-panel">
                <h5>Información del Video</h5>
                
                {/* Nombre del Video */}
                <div className="form-group">
                  <label>Nombre del Video</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe el nombre del video"
                    value={videoName}
                    onChange={(e) => setVideoName(e.target.value)}
                  />
                </div>

                {/* Archivo de Video */}
                <div className="form-group">
                  <label>Archivo de Video (obligatorio)</label>
                  <div className="file-input-display">
                    <span className="file-name">{videoInfo?.name || 'Ningún archivo seleccionado'}</span>
                  </div>
                </div>

                {/* Subtítulos */}
                <div className="form-group">
                  <label>Subtítulos (mínimo 2, máximo 5)</label>
                  <div className="file-input-display">
                    <span className="file-name">
                      {subtitles.length > 0 ? `${subtitles.length} archivo(s) seleccionado(s)` : 'Ningún archivo seleccionado'}
                    </span>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={addSubtitle}
                      disabled={subtitles.length >= 5}
                    >
                      + Añadir subtítulo
                    </button>
                  </div>
                  {subtitles.length > 0 && (
                    <div className="files-list">
                      {subtitles.map((subtitle, index) => (
                        <div key={subtitle.id} className="file-item">
                          <span>{subtitle.name}</span>
                          <div className="file-actions">
                            <select 
                              className="form-select form-select-sm"
                              value={subtitle.language}
                              onChange={(e) => {
                                setSubtitles(prev => prev.map(sub => 
                                  sub.id === subtitle.id ? {...sub, language: e.target.value} : sub
                                ));
                              }}
                            >
                              <option value="es">es</option>
                              <option value="en">en</option>
                            </select>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeSubtitle(subtitle.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pistas de Audio */}
                <div className="form-group">
                  <label>Pistas de Audio (opcional, máximo 5)</label>
                  <div className="file-input-display">
                    <span className="file-name">
                      {audioTracks.length > 0 ? `${audioTracks.length} archivo(s) seleccionado(s)` : 'Ningún archivo seleccionado'}
                    </span>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={addAudioTrack}
                      disabled={audioTracks.length >= 5}
                    >
                      + Añadir pista de audio
                    </button>
                  </div>
                  {audioTracks.length > 0 && (
                    <div className="files-list">
                      {audioTracks.map((track, index) => (
                        <div key={track.id} className="file-item">
                          <span>{track.name}</span>
                          <div className="file-actions">
                            <select 
                              className="form-select form-select-sm"
                              value={track.language}
                              onChange={(e) => {
                                setAudioTracks(prev => prev.map(t => 
                                  t.id === track.id ? {...t, language: e.target.value} : t
                                ));
                              }}
                            >
                              <option value="es">es</option>
                              <option value="en">en</option>
                            </select>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeAudioTrack(track.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {videoInfo && (
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Extensión:</strong>
                      <span>{videoInfo.extension}</span>
                    </div>
                    <div className="info-item">
                      <strong>Tamaño:</strong>
                      <span>{videoInfo.size}</span>
                    </div>
                    <div className="info-item">
                      <strong>Duración:</strong>
                      <span>{formatDuration(videoInfo.duration)}</span>
                    </div>
                    <div className="info-item">
                      <strong>Dimensiones:</strong>
                      <span>{videoInfo.width} × {videoInfo.height}</span>
                    </div>
                    <div className="info-item">
                      <strong>Tipo:</strong>
                      <span>{videoInfo.type}</span>
                    </div>
                  </div>
                )}

                <div className="video-preview-info">
                  <h6>Vista Previa</h6>
                  <p className="text-muted">
                    El video se mostrará en el carrusel de videos en la página principal.
                  </p>
                  <div className="preview-details">
                    <div className="detail-item">
                      <i className="fas fa-play-circle"></i>
                      <span>Reproducción automática</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-volume-mute"></i>
                      <span>Sin sonido por defecto</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-expand"></i>
                      <span>Responsive design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
