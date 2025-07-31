import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultimediaAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Estados para formularios
  const [videoForm, setVideoForm] = useState({
    name: '',
    format: '',
    duration: '',
    size: '',
    audioTracks: [{ lang: 'es', file: null }, { lang: 'en', file: null }],
    subtitles: [{ lang: 'es', file: null }, { lang: 'en', file: null }],
    file: null,
  });
  const [imageForm, setImageForm] = useState({
    name: '',
    format: '',
    size: '',
    dimensions: '',
    file: null,
  });

  // Estados para previews
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchVideos();
    fetchImages();
  }, []);

  // Funciones para conectar con el backend
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(response.data);
    } catch (error) {
      showToast('Error al cargar videos', 'error');
    }
  };

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/imagenes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(response.data);
    } catch (error) {
      showToast('Error al cargar imágenes', 'error');
    }
  };

  // Función para mostrar toasts
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Handlers para formularios con preview
  const handleVideoFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('audio-')) {
      const idx = parseInt(name.split('-')[1], 10);
      const newTracks = [...videoForm.audioTracks];
      newTracks[idx].file = files[0];
      setVideoForm({ ...videoForm, audioTracks: newTracks });
    } else if (name.startsWith('subtitle-')) {
      const idx = parseInt(name.split('-')[1], 10);
      const newSubs = [...videoForm.subtitles];
      newSubs[idx].file = files[0];
      setVideoForm({ ...videoForm, subtitles: newSubs });
    } else if (name === 'file') {
      const file = files[0];
      setVideoForm({ ...videoForm, file });
      if (file) {
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
      }
    } else {
      setVideoForm({ ...videoForm, [name]: value });
    }
  };

  const handleImageFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      setImageForm({ ...imageForm, file });
      if (file) {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
      }
    } else {
      setImageForm({ ...imageForm, [name]: value });
    }
  };

  // Funciones CRUD
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', videoForm.name);
      formData.append('format', videoForm.format);
      formData.append('duration', videoForm.duration);
      formData.append('size', videoForm.size);
      formData.append('file', videoForm.file);
      
      videoForm.audioTracks.forEach((track, idx) => {
        if (track.file) {
          formData.append(`audioTracks[${idx}][lang]`, track.lang);
          formData.append(`audioTracks[${idx}][file]`, track.file);
          formData.append(`audioTracks[${idx}][duration]`, videoForm.duration);
        }
      });
      
      videoForm.subtitles.forEach((sub, idx) => {
        if (sub.file) {
          formData.append(`subtitles[${idx}][lang]`, sub.lang);
          formData.append(`subtitles[${idx}][file]`, sub.file);
          formData.append(`subtitles[${idx}][duration]`, videoForm.duration);
        }
      });

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/videos', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showToast('Video guardado exitosamente');
      setVideoForm({
        name: '', format: '', duration: '', size: '',
        audioTracks: [{ lang: 'es', file: null }, { lang: 'en', file: null }],
        subtitles: [{ lang: 'es', file: null }, { lang: 'en', file: null }],
        file: null,
      });
      setVideoPreview(null);
      fetchVideos();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error al guardar video', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', imageForm.name);
      formData.append('format', imageForm.format);
      formData.append('size', imageForm.size);
      formData.append('dimensions', imageForm.dimensions);
      formData.append('file', imageForm.file);

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/imagenes', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showToast('Imagen guardada exitosamente');
      setImageForm({ name: '', format: '', size: '', dimensions: '', file: null });
      setImagePreview(null);
      fetchImages();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error al guardar imagen', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Carrusel Bootstrap para imágenes y videos
  const renderCarousel = () => {
    const items = activeMenu === 'images' ? images : videos;
    if (!items.length) return (
      <div className="alert alert-secondary text-center my-4">No hay elementos para mostrar.</div>
    );
    return (
      <div id="mediaCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner">
          {items.map((item, idx) => (
            <div className={`carousel-item${idx === carouselIndex ? ' active' : ''}`} key={idx}>
              {activeMenu === 'images' ? (
                <img src={item.file} className="d-block mx-auto rounded" alt={item.name} style={{ maxHeight: 320, maxWidth: '100%', objectFit: 'cover' }} />
              ) : (
                <video controls className="d-block mx-auto rounded bg-dark" style={{ maxHeight: 320, maxWidth: '100%' }}>
                  <source src={item.file} type={item.format || 'video/mp4'} />
                  {item.subtitles && item.subtitles.map((sub, idx2) => (
                    <track key={idx2} label={sub.lang} kind="subtitles" srcLang={sub.lang} src={sub.file} default={idx2 === 0} />
                  ))}
                </video>
              )}
              <div className="carousel-caption d-none d-md-block">
                <h5>{item.name}</h5>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" onClick={() => setCarouselIndex((carouselIndex - 1 + items.length) % items.length)}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" onClick={() => setCarouselIndex((carouselIndex + 1) % items.length)}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
        <div className="carousel-indicators">
          {items.map((_, idx) => (
            <button key={idx} type="button" className={idx === carouselIndex ? 'active' : ''} aria-current={idx === carouselIndex} aria-label={`Slide ${idx + 1}`} onClick={() => setCarouselIndex(idx)}></button>
          ))}
        </div>
      </div>
    );
  };

  // Protección solo admin
  if (localStorage.getItem('role') !== 'admin') {
    return <div className="alert alert-danger text-center mt-5">No tienes permisos para acceder a esta vista.</div>;
  }

  return (
    <div className="container-fluid">
      <style>{`
        .preview-container { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .preview-video, .preview-image { max-width: 100%; max-height: 300px; border-radius: 8px; }
        .toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; }
        .custom-toast { background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 16px; margin-bottom: 10px; border-left: 4px solid; }
        .custom-toast.success { border-left-color: #28a745; }
        .custom-toast.error { border-left-color: #dc3545; }
        .form-section { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 24px; }
        .file-input-group { position: relative; }
        .file-input-group input[type="file"] { opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; }
        .file-input-group .btn { pointer-events: none; }
        .nav-tabs .nav-link { color: #6c757d; border: none; padding: 12px 24px; font-weight: 500; }
        .nav-tabs .nav-link.active { color: #198754; background: none; border-bottom: 3px solid #198754; }
        .nav-tabs .nav-link:hover { color: #198754; border-color: transparent; }
        .file-btn { background: #6c757d; color: white; border: 2px solid #6c757d; transition: all 0.3s; }
        .file-btn:hover { background: #5a6268; border-color: #5a6268; color: white; }
        .file-btn:active { background: #545b62; border-color: #545b62; }
        .form-control::placeholder { color: #6c757d !important; opacity: 1 !important; }
        .form-control:focus { border-color: #198754; box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25); }
        .input-group-text { background: #e9ecef; color: #495057; font-weight: 500; }
        .btn-success { background: #198754; border-color: #198754; }
        .btn-success:hover { background: #157347; border-color: #146c43; }
        .btn-outline-secondary { color: #6c757d; border-color: #6c757d; }
        .btn-outline-secondary:hover { background: #6c757d; border-color: #6c757d; color: white; }
        .table-success { background: #d1e7dd !important; }
        .badge { font-size: 0.875em; }
        .alert-secondary { background: #e2e3e5; color: #41464b; }
      `}</style>
      
      {/* Toast Container */}
      {toast.show && (
        <div className="toast-container">
          <div className={`custom-toast ${toast.type}`}>
            <strong>{toast.type === 'success' ? '✓' : '✗'}</strong> {toast.message}
          </div>
        </div>
      )}

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-success">Gestión de Multimedia</h3>
        </div>

        {/* Tabs de navegación */}
        <ul className="nav nav-tabs mb-4" id="multimediaTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeMenu === 'videos' ? 'active' : ''}`} 
              onClick={() => { setActiveMenu('videos'); setCarouselIndex(0); }}
            >
              <i className="bi bi-film me-2"></i> Videos
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeMenu === 'images' ? 'active' : ''}`} 
              onClick={() => { setActiveMenu('images'); setCarouselIndex(0); }}
            >
              <i className="bi bi-image me-2"></i> Imágenes
            </button>
          </li>
        </ul>

        {/* Carrusel */}
        {renderCarousel()}

        {/* Formulario */}
        <div className="form-section">
          {activeMenu === 'videos' ? (
            <>
              <h4 className="mb-4 text-success">Agregar Video</h4>
              <form onSubmit={handleSaveVideo}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre</label>
                    <input className="form-control" name="name" value={videoForm.name} onChange={handleVideoFormChange} placeholder="Ingrese el nombre del video" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Formato</label>
                    <input className="form-control" name="format" value={videoForm.format} onChange={handleVideoFormChange} placeholder="mp4, avi, etc." required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Duración (seg)</label>
                    <input className="form-control" name="duration" value={videoForm.duration} onChange={handleVideoFormChange} type="number" placeholder="120" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Tamaño (MB)</label>
                    <input className="form-control" name="size" value={videoForm.size} onChange={handleVideoFormChange} type="number" placeholder="50" required />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-bold">Archivo de video</label>
                    <div className="file-input-group">
                      <button type="button" className="btn file-btn w-100">📁 Seleccionar video</button>
                      <input className="form-control" name="file" type="file" onChange={handleVideoFormChange} accept="video/*" required />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Pistas de audio (mínimo 2)</label>
                    <div className="row g-2">
                      {videoForm.audioTracks.map((track, idx) => (
                        <div className="col-md-6" key={idx}>
                          <div className="input-group">
                            <span className="input-group-text fw-bold">{track.lang.toUpperCase()}</span>
                            <div className="file-input-group flex-grow-1">
                              <button type="button" className="btn file-btn w-100">🎵 Audio {track.lang}</button>
                              <input className="form-control" name={`audio-${idx}`} type="file" onChange={handleVideoFormChange} accept="audio/*" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Subtítulos (mínimo 2, .vtt)</label>
                    <div className="row g-2">
                      {videoForm.subtitles.map((sub, idx) => (
                        <div className="col-md-6" key={idx}>
                          <div className="input-group">
                            <span className="input-group-text fw-bold">{sub.lang.toUpperCase()}</span>
                            <div className="file-input-group flex-grow-1">
                              <button type="button" className="btn file-btn w-100">📝 Subtítulo {sub.lang}</button>
                              <input className="form-control" name={`subtitle-${idx}`} type="file" accept=".vtt" onChange={handleVideoFormChange} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="btn btn-success mt-4 px-4 py-2 fw-bold" type="submit" disabled={loading}>
                  {loading ? '⏳ Guardando...' : '💾 Guardar Video'}
                </button>
              </form>

              {/* Preview de video */}
              {videoPreview && (
                <div className="preview-container mt-4">
                  <h6 className="fw-bold">🎬 Preview del video:</h6>
                  <video controls className="preview-video">
                    <source src={videoPreview} type="video/mp4" />
                    {videoForm.subtitles.map((sub, idx) => (
                      sub.file && <track key={idx} label={sub.lang} kind="subtitles" srcLang={sub.lang} src={URL.createObjectURL(sub.file)} default={idx === 0} />
                    ))}
                  </video>
                </div>
              )}
            </>
          ) : (
            <>
              <h4 className="mb-4 text-success">Agregar Imagen</h4>
              <form onSubmit={handleSaveImage}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre</label>
                    <input className="form-control" name="name" value={imageForm.name} onChange={handleImageFormChange} placeholder="Ingrese el nombre de la imagen" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Formato</label>
                    <input className="form-control" name="format" value={imageForm.format} onChange={handleImageFormChange} placeholder="jpg, png, etc." required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Tamaño (MB)</label>
                    <input className="form-control" name="size" value={imageForm.size} onChange={handleImageFormChange} type="number" placeholder="2" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Dimensiones (ej: 1000x1000)</label>
                    <input className="form-control" name="dimensions" value={imageForm.dimensions} onChange={handleImageFormChange} placeholder="1920x1080" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Archivo de imagen</label>
                    <div className="file-input-group">
                      <button type="button" className="btn file-btn w-100">🖼️ Seleccionar imagen</button>
                      <input className="form-control" name="file" type="file" onChange={handleImageFormChange} accept="image/*" required />
                    </div>
                  </div>
                </div>
                <button className="btn btn-success mt-4 px-4 py-2 fw-bold" type="submit" disabled={loading}>
                  {loading ? '⏳ Guardando...' : '💾 Guardar Imagen'}
                </button>
              </form>

              {/* Preview de imagen */}
              {imagePreview && (
                <div className="preview-container mt-4">
                  <h6 className="fw-bold">🖼️ Preview de la imagen:</h6>
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Listado */}
        <div className="form-section">
          <h5 className="mb-3 fw-bold">📋 Listado de {activeMenu === 'videos' ? 'Videos' : 'Imágenes'}</h5>
          {activeMenu === 'videos' ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th className="fw-bold">Nombre</th><th className="fw-bold">Formato</th><th className="fw-bold">Duración</th><th className="fw-bold">Tamaño</th><th className="fw-bold">Pistas</th><th className="fw-bold">Subs</th><th className="fw-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((v, i) => (
                    <tr key={i}>
                      <td className="fw-medium">{v.name}</td>
                      <td>{v.format}</td>
                      <td>{v.duration}</td>
                      <td>{v.size}</td>
                      <td><span className="badge bg-success fw-bold">{v.audioTracks.length}</span></td>
                      <td><span className="badge bg-success fw-bold">{v.subtitles.length}</span></td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm me-1" title="Editar">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm" title="Eliminar">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th className="fw-bold">Nombre</th><th className="fw-bold">Formato</th><th className="fw-bold">Tamaño</th><th className="fw-bold">Dimensiones</th><th className="fw-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img, i) => (
                    <tr key={i}>
                      <td className="fw-medium">{img.name}</td>
                      <td>{img.format}</td>
                      <td>{img.size}</td>
                      <td>{img.dimensions}</td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm me-1" title="Editar">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm" title="Eliminar">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultimediaAdmin;