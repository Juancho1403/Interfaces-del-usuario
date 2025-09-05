import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedImageEditor from '../components/AdvancedImageEditor';
import VideoEditor from '../components/VideoEditor';
import VideoViewer from '../components/VideoViewer';
import { Carousel } from 'react-bootstrap';
import { useCarousel } from '../context/CarouselContext';

const MultimediaAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('images');
  const [videos, setVideos] = useState([]);
  const [videoThumbnails, setVideoThumbnails] = useState({}); // id -> thumbnail
  // Extraer primer frame de un video
  const extractThumbnail = (videoSrc, videoId) => {
    if (!videoSrc || !videoId) return;
    const tempVideo = document.createElement('video');
    tempVideo.src = videoSrc;
    tempVideo.preload = 'auto';
    tempVideo.muted = true;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.addEventListener('loadedmetadata', () => {
      try {
        tempVideo.currentTime = 0.01;
      } catch {}
    }, { once: true });
    tempVideo.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth;
        canvas.height = tempVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setVideoThumbnails(prev => ({ ...prev, [videoId]: dataUrl }));
      } catch {}
    }, { once: true });
  };
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselType, setCarouselType] = useState('images'); // 'images' o 'videos'
  const [selectedCarouselImages, setSelectedCarouselImages] = useState([]);
  const [selectedCarouselVideos, setSelectedCarouselVideos] = useState([]);
  const { 
    carouselImages, 
    carouselVideos, 
    addCarouselImage, 
    addCarouselVideo, 
    removeCarouselImage, 
    removeCarouselVideo 
  } = useCarousel();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchVideos();
    fetchImages();
  }, []);

  // Extraer miniaturas cuando videos cambian
  useEffect(() => {
    videos.forEach(video => {
      if (!videoThumbnails[video.id] && video.file) {
        extractThumbnail(video.file, video.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

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

  // Función para limpiar galería completa
  const clearGallery = () => {
    if (activeMenu === 'images') {
      setImages([]);
      showToast('Galería de imágenes limpiada');
    } else {
      setVideos([]);
      showToast('Galería de videos limpiada');
    }
  };

  // Función para eliminar del carrusel
  const removeFromCarousel = (itemId, type) => {
    if (type === 'image') {
      removeCarouselImage(itemId);
      showToast('Imagen eliminada del carrusel');
    } else {
      removeCarouselVideo(itemId);
      showToast('Video eliminado del carrusel');
    }
  };

  // Utilidades para saber si un item ya está en el carrusel
  const isImageInCarousel = (image) => {
    return carouselImages.some(ci => ci.src === image.file || ci.info?.name === image.name || ci.name === image.name);
  };
  const isVideoInCarousel = (video) => {
    return carouselVideos.some(cv => cv.src === video.file || cv.info?.name === video.name || cv.name === video.name);
  };

  // Función para agregar al carrusel original
  const addToOriginalCarousel = (item) => {
    if (activeMenu === 'images') {
      addCarouselImage(item.file, {
        name: item.name,
        size: item.size,
        extension: item.format,
        originalWidth: item.dimensions.split(' × ')[0],
        originalHeight: item.dimensions.split(' × ')[1],
        type: 'image/jpeg'
      });
      showToast('Imagen agregada al carrusel original');
    } else {
      addCarouselVideo(item.file, {
        name: item.name,
        size: item.size,
        extension: item.format,
        duration: item.duration,
        audioTracks: item.audioTracks || [],
        subtitles: item.subtitles || []
      });
      showToast('Video agregado al carrusel original');
    }
  };

  // Función para manejar imágenes editadas
  const handleImageSave = (imageUrl, imageInfo) => {
    // Guardar en el carrusel del home
    addCarouselImage(imageUrl, imageInfo);
    
    // También agregar a la galería local
    const newImage = {
      id: Date.now(),
      file: imageUrl,
      name: imageInfo.name,
      dimensions: `${imageInfo.croppedWidth || imageInfo.originalWidth} × ${imageInfo.croppedHeight || imageInfo.originalHeight}`,
      size: imageInfo.croppedSize || imageInfo.size,
      format: imageInfo.extension,
      info: imageInfo
    };
    setImages(prev => [...prev, newImage]);
    
    setShowImageEditor(false);
    showToast('Imagen guardada en el carrusel y galería!');
  };

  // Función para subir imagen sin recorte
  const handleQuickUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const imageInfo = {
              name: file.name,
              size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
              extension: file.name.split('.').pop().toUpperCase(),
              originalWidth: img.width,
              originalHeight: img.height,
              type: file.type
            };
            
            // Guardar en el carrusel del home
            addCarouselImage(e.target.result, imageInfo);
            
            // También agregar a la galería local
            const newImage = {
              id: Date.now(),
              file: e.target.result,
              name: file.name,
              dimensions: `${img.width} × ${img.height}`,
              size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
              format: file.name.split('.').pop().toUpperCase(),
              info: imageInfo
            };
            setImages(prev => [...prev, newImage]);
            
            showToast('Imagen subida sin recorte al carrusel y galería!');
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Función para manejar videos
  const handleVideoSave = (videoUrl, videoInfo) => {
    // Guardar directamente en el carrusel del home
    addCarouselVideo(videoUrl, videoInfo);
    setShowVideoEditor(false);
    showToast('Video guardado en el carrusel del home!');
    // También agregar a la galería local de videos para que se vea inmediatamente
    const newVideo = {
      id: Date.now(),
      file: videoUrl,
      name: videoInfo.name,
      duration: Math.round(videoInfo.duration || 0),
      size: (parseFloat((videoInfo.size || '0').toString()) || 0),
      format: videoInfo.extension || 'MP4',
      audioTracks: videoInfo.audioTracks || [],
      subtitles: videoInfo.subtitles || []
    };
    setVideos(prev => [...prev, newVideo]);
  };

  // Función para mostrar detalles del item
  const showItemDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Función para ver/editar video
  const handleVideoView = (video) => {
    setSelectedItem(video);
    setShowVideoViewer(true);
  };

  // Función para eliminar imagen de la galería
  const handleDeleteImage = (index) => {
    const imageToDelete = images[index];
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // También eliminar del carrusel si existe
    if (imageToDelete.info) {
      // Aquí podrías implementar la lógica para eliminar del carrusel
      // Por ahora solo eliminamos de la galería local
    }
    
    showToast('Imagen eliminada de la galería');
  };

  // Función para eliminar video de la galería
  const handleDeleteVideo = (index) => {
    const videoToDelete = videos[index];
    setVideos(prev => prev.filter((_, i) => i !== index));
    showToast('Video eliminado de la galería');
  };

  // Función para mostrar carrusel
  const showCarousel = (type) => {
    setCarouselType(type);
    setShowCarouselModal(true);
    
    // Mostrar mensaje si el carrusel está vacío
    if (type === 'images' && carouselImages.length === 0) {
      showToast('El carrusel de imágenes está vacío. Agrega imágenes primero.', 'warning');
    } else if (type === 'videos' && carouselVideos.length === 0) {
      showToast('El carrusel de videos está vacío. Agrega videos primero.', 'warning');
    }
  };

  // Protección solo admin
  if (localStorage.getItem('role') !== 'admin') {
    return <div className="alert alert-danger text-center mt-5">No tienes permisos para acceder a esta vista.</div>;
  }

  return (
    <div className="container-fluid">
      <style>{`
        .toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; }
        .custom-toast { background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 16px; margin-bottom: 10px; border-left: 4px solid; }
        .custom-toast.success { border-left-color: #28a745; }
        .custom-toast.error { border-left-color: #dc3545; }
        .custom-toast.warning { border-left-color: #ffc107; }
        .gallery-section { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 24px; }
        .nav-tabs .nav-link { color: #6c757d; border: none; padding: 12px 24px; font-weight: 500; }
        .nav-tabs .nav-link.active { color: #198754; background: none; border-bottom: 3px solid #198754; }
        .nav-tabs .nav-link:hover { color: #198754; border-color: transparent; }
        .media-card { cursor: pointer; transition: transform 0.2s; border-radius: 12px; overflow: hidden; }
        .media-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .media-card img, .media-card video { width: 100%; height: 200px; object-fit: cover; }
        .modal-content { border-radius: 12px; }
        .modal-header { background: #198754; color: white; border-radius: 12px 12px 0 0; }
        .btn-close { filter: invert(1); }
        .upload-btn { background: linear-gradient(45deg, #198754, #20c997); border: none; color: white; padding: 15px 30px; border-radius: 25px; font-weight: 600; transition: all 0.3s; }
        .upload-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(25, 135, 84, 0.3); color: white; }
        .empty-state { text-align: center; padding: 60px 20px; color: #6c757d; }
        .empty-state i { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
        .image-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .image-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .image-preview { position: relative; overflow: hidden; }
        .image-preview img { width: 100%; height: 200px; object-fit: cover; }
        .image-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .image-card:hover .image-overlay { opacity: 1; }
        .image-info { padding: 12px; }
        .empty-gallery { text-align: center; padding: 80px 20px; color: #6c757d; }
        .empty-gallery i { font-size: 5rem; margin-bottom: 20px; opacity: 0.3; }
        .action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        .action-buttons .btn { font-size: 0.8rem; padding: 4px 8px; }
        .carousel-preview { background: #f8f9fa; border-radius: 8px; padding: 16px; margin-top: 16px; }
        .carousel-item { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 6px; background: white; margin-bottom: 8px; }
        .carousel-item img, .carousel-item video { width: 60px; height: 40px; object-fit: cover; border-radius: 4px; }
        .carousel-item-info { flex: 1; }
        .carousel-item-actions { display: flex; gap: 4px; }
        .btn-danger-sm { background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; }
        .btn-danger-sm:hover { background: #c82333; }
        .stats-card { background: linear-gradient(45deg, #198754, #20c997); color: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .stats-number { font-size: 2rem; font-weight: bold; }
        .stats-label { font-size: 0.9rem; opacity: 0.9; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline-warning:disabled { color: #6c757d; border-color: #6c757d; }
      `}</style>
      
      {/* Toast Container */}
      {toast.show && (
        <div className="toast-container">
          <div className={`custom-toast ${toast.type}`}>
            <strong>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : '⚠'}</strong> {toast.message}
          </div>
        </div>
      )}

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-success">Gestión de Multimedia</h3>
        </div>

        {/* Estadísticas */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stats-card">
              <div className="stats-number">{images.length}</div>
              <div className="stats-label">Imágenes en Galería</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="stats-number">{videos.length}</div>
              <div className="stats-label">Videos en Galería</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="stats-number">{carouselImages.length}</div>
              <div className="stats-label">Imágenes en Carrusel</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="stats-number">{carouselVideos.length}</div>
              <div className="stats-label">Videos en Carrusel</div>
            </div>
          </div>
        </div>

        {/* Información sobre el carrusel */}
        {(carouselImages.length === 0 || carouselVideos.length === 0) && (
          <div className="alert alert-info mb-4">
            <h6><i className="bi bi-info-circle me-2"></i>¿Cómo agregar contenido al carrusel?</h6>
            <ul className="mb-0">
              {carouselImages.length === 0 && (
                <li><strong>Imágenes:</strong> Sube imágenes usando "Subir y Recortar" o "Subir Sin Recorte", luego usa el botón "Carrusel" en cada imagen para agregarla al carrusel.</li>
              )}
              {carouselVideos.length === 0 && (
                <li><strong>Videos:</strong> Sube videos usando "Subir Video", luego usa el botón "Carrusel" en cada video para agregarlo al carrusel.</li>
              )}
            </ul>
          </div>
        )}

        {/* Gestión rápida de carrusel con checkboxes */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <strong>Imágenes en carrusel ({carouselImages.length})</strong>
                  <div className="form-check m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAllImages"
                      checked={selectedCarouselImages.length > 0 && selectedCarouselImages.length === carouselImages.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCarouselImages(carouselImages.map(ci => ci.id));
                        } else {
                          setSelectedCarouselImages([]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="selectAllImages">Seleccionar todo</label>
                  </div>
                  <span className="badge bg-secondary">{selectedCarouselImages.length} seleccionadas</span>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={selectedCarouselImages.length === 0}
                  onClick={() => {
                    selectedCarouselImages.forEach(id => removeCarouselImage(id));
                    setSelectedCarouselImages([]);
                    showToast('Imágenes quitadas del carrusel');
                  }}
                >
                  Quitar seleccionados
                </button>
              </div>
              <ul className="list-group list-group-flush" style={{ maxHeight: 220, overflowY: 'auto' }}>
                {carouselImages.map(img => (
                  <li key={img.id} className="list-group-item d-flex align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={selectedCarouselImages.includes(img.id)}
                      onChange={(e) => {
                        setSelectedCarouselImages(prev => e.target.checked ? [...prev, img.id] : prev.filter(id => id !== img.id));
                      }}
                    />
                    <img src={img.src} alt={img.name} style={{ width: 48, height: 32, objectFit: 'cover' }} className="me-2" />
                    <span className="flex-grow-1 small text-truncate">{img.name}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeCarouselImage(img.id)}>Quitar</button>
                  </li>
                ))}
                {carouselImages.length === 0 && (
                  <li className="list-group-item text-muted">Sin imágenes</li>
                )}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <strong>Videos en carrusel ({carouselVideos.length})</strong>
                  <div className="form-check m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAllVideos"
                      checked={selectedCarouselVideos.length > 0 && selectedCarouselVideos.length === carouselVideos.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCarouselVideos(carouselVideos.map(cv => cv.id));
                        } else {
                          setSelectedCarouselVideos([]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="selectAllVideos">Seleccionar todo</label>
                  </div>
                  <span className="badge bg-secondary">{selectedCarouselVideos.length} seleccionados</span>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={selectedCarouselVideos.length === 0}
                  onClick={() => {
                    selectedCarouselVideos.forEach(id => removeCarouselVideo(id));
                    setSelectedCarouselVideos([]);
                    showToast('Videos quitados del carrusel');
                  }}
                >
                  Quitar seleccionados
                </button>
              </div>
              <ul className="list-group list-group-flush" style={{ maxHeight: 220, overflowY: 'auto' }}>
                {carouselVideos.map((vid) => (
                  <li key={vid.id} className="list-group-item d-flex align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={selectedCarouselVideos.includes(vid.id)}
                      onChange={(e) => {
                        setSelectedCarouselVideos(prev => e.target.checked ? [...prev, vid.id] : prev.filter(id => id !== vid.id));
                      }}
                    />
                    {videoThumbnails[vid.id] ? (
                      <img src={videoThumbnails[vid.id]} alt={vid.name} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, background: '#222' }} />
                    ) : (
                      <div style={{ width: 48, height: 32, background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '1.2rem' }}>
                        <i className="bi bi-film"></i>
                      </div>
                    )}
                    <span className="flex-grow-1 small text-truncate">{vid.name}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeCarouselVideo(vid.id)}>Quitar</button>
                  </li>
                ))}
                {carouselVideos.length === 0 && (
                  <li className="list-group-item text-muted">Sin videos</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <ul className="nav nav-tabs mb-4" id="multimediaTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeMenu === 'images' ? 'active' : ''}`} 
              onClick={() => setActiveMenu('images')}
            >
              <i className="bi bi-image me-2"></i> Imágenes
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeMenu === 'videos' ? 'active' : ''}`} 
              onClick={() => setActiveMenu('videos')}
            >
              <i className="bi bi-film me-2"></i> Videos
            </button>
          </li>
        </ul>

        {/* Sección de Imágenes */}
        {activeMenu === 'images' && (
          <div className="gallery-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-success mb-0">Galería de Imágenes</h4>
              <div className="d-flex gap-2">
                {/* Botón Ver Carrusel eliminado para simplificar flujo */}
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearGallery}
                >
                  <i className="bi bi-trash me-2"></i>
                  Limpiar Galería
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => setShowImageEditor(true)}
                >
                  <i className="bi bi-crop me-2"></i>
                  Subir y Recortar
                </button>
                <button 
                  className="btn upload-btn"
                  onClick={() => handleQuickUpload()}
                >
                  <i className="bi bi-camera me-2"></i>
                  Subir Sin Recorte
                </button>
              </div>
            </div>

            {images.length === 0 ? (
              <div className="empty-gallery">
                <i className="bi bi-images"></i>
                <h5>No hay imágenes en la galería</h5>
                <p>Usa los botones de arriba para agregar contenido</p>
              </div>
            ) : (
              <div className="row g-4">
                {images.map((image, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="image-card">
                      <div className="image-preview">
                        <img src={image.file} alt={image.name || `Imagen ${index + 1}`} />
                        <div className="image-overlay">
                          <div className="action-buttons">
                            <button 
                              className="btn btn-sm btn-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                showItemDetails(image);
                              }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {isImageInCarousel(image) ? (
                              <button 
                                className="btn btn-sm btn-warning"
                                title="Quitar del carrusel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const inCarousel = carouselImages.find(ci => ci.src === image.file || ci.info?.name === image.name || ci.name === image.name);
                                  if (inCarousel) removeCarouselImage(inCarousel.id);
                                  showToast('Imagen quitada del carrusel');
                                }}
                              >
                                <i className="bi bi-dash-circle"></i>
                              </button>
                            ) : (
                              <button 
                                className="btn btn-sm btn-success"
                                title="Añadir al carrusel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToOriginalCarousel(image);
                                }}
                              >
                                <i className="bi bi-plus-circle"></i>
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(index);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="image-info">
                        <h6 className="mb-2">{image.name || `Imagen ${index + 1}`}</h6>
                        <div className="small text-muted">
                          <div>Dimensiones: {image.dimensions}</div>
                          <div>Tamaño: {image.size}</div>
                          <div>Formato: {image.format}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sección de Videos */}
        {activeMenu === 'videos' && (
          <div className="gallery-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-success mb-0">Galería de Videos</h4>
              <div className="d-flex gap-2">
                {/* Botón Ver Carrusel eliminado para simplificar flujo */}
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearGallery}
                >
                  <i className="bi bi-trash me-2"></i>
                  Limpiar Galería
                </button>
                <button 
                  className="btn upload-btn"
                  onClick={() => setShowVideoEditor(true)}
                >
                  <i className="bi bi-camera-video me-2"></i>
                  Subir Video
                </button>
              </div>
            </div>

            {videos.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-camera-video"></i>
                <h5>No hay videos en la galería</h5>
                <p>Usa el botón "Subir Video" para agregar contenido</p>
              </div>
            ) : (
              <div className="row g-4">
                {videos.map((video, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="card media-card">
                      {videoThumbnails[video.id] ? (
                        <img className="card-img-top" src={videoThumbnails[video.id]} alt={video.name} style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#222' }} />
                      ) : (
                        <div style={{ width: '100%', height: '200px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '2.5rem' }}>
                          <i className="bi bi-film"></i>
                        </div>
                      )}
                      <div className="card-body">
                        <h6 className="card-title">{video.name}</h6>
                        <div className="small text-muted mb-3">
                          <div>Duración: {video.duration} seg</div>
                          <div>Tamaño: {video.size} MB</div>
                          <div>Formato: {video.format}</div>
                          <div>Pistas de audio: {video.audioTracks?.length || 0}</div>
                          <div>Subtítulos: {video.subtitles?.length || 0}</div>
                        </div>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-info"
                            onClick={() => showItemDetails(video)}
                          >
                            <i className="bi bi-eye"></i> Ver
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleVideoView(video)}
                          >
                            <i className="bi bi-play-circle"></i> Reproducir
                          </button>
                          {isVideoInCarousel(video) ? (
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => {
                                const inCarousel = carouselVideos.find(cv => cv.src === video.file || cv.info?.name === video.name || cv.name === video.name);
                                if (inCarousel) removeCarouselVideo(inCarousel.id);
                                showToast('Video quitado del carrusel');
                              }}
                            >
                              <i className="bi bi-dash-circle"></i> Quitar
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => addToOriginalCarousel(video)}
                            >
                              <i className="bi bi-plus-circle"></i> Carrusel
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteVideo(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal del Editor de Imágenes */}
      {showImageEditor && (
        <AdvancedImageEditor 
          onImageSave={handleImageSave}
          onClose={() => setShowImageEditor(false)}
        />
      )}

      {/* Modal del Editor de Videos */}
      {showVideoEditor && (
        <VideoEditor 
          onVideoSave={handleVideoSave}
          onClose={() => setShowVideoEditor(false)}
        />
      )}

      {/* Modal del Visor de Videos */}
      {showVideoViewer && selectedItem && (
        <VideoViewer 
          video={selectedItem}
          onClose={() => setShowVideoViewer(false)}
        />
      )}

      {/* Modal de Detalles */}
      {showModal && selectedItem && (
  <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${activeMenu === 'images' ? 'bi-image' : 'bi-camera-video'} me-2`}></i>
                  Detalles de {activeMenu === 'images' ? 'Imagen' : 'Video'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    {activeMenu === 'images' ? (
                      <div className="text-center">
                        <img src={selectedItem.file} className="img-fluid rounded shadow" alt={selectedItem.name} style={{ maxHeight: '400px' }} />
                      </div>
                    ) : (
                      <video controls className="img-fluid rounded shadow">
                        <source src={selectedItem.file} type={selectedItem.format || 'video/mp4'} />
                      </video>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6>Información General</h6>
                    <ul className="list-unstyled">
                      <li><strong>Nombre:</strong> {selectedItem.name}</li>
                      <li><strong>Formato:</strong> {selectedItem.format}</li>
                      <li><strong>Tamaño:</strong> {selectedItem.size} MB</li>
                      {activeMenu === 'images' ? (
                        <li><strong>Dimensiones:</strong> {selectedItem.dimensions}</li>
                      ) : (
                        <>
                          <li><strong>Duración:</strong> {selectedItem.duration} segundos</li>
                          <li><strong>Pistas de audio:</strong> {selectedItem.audioTracks?.length || 0}</li>
                          <li><strong>Subtítulos:</strong> {selectedItem.subtitles?.length || 0}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => {
                      addToOriginalCarousel(selectedItem);
                      showToast((activeMenu === 'images' ? 'Imagen' : 'Video') + ' agregado al carrusel');
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Añadir al carrusel
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => {
                      if (activeMenu === 'images') {
                        const inCarousel = carouselImages.find(ci => ci.info?.name === selectedItem.name || ci.src === selectedItem.file);
                        if (inCarousel) removeCarouselImage(inCarousel.id);
                      } else {
                        const inCarousel = carouselVideos.find(cv => cv.info?.name === selectedItem.name || cv.src === selectedItem.file);
                        if (inCarousel) removeCarouselVideo(inCarousel.id);
                      }
                      showToast((activeMenu === 'images' ? 'Imagen' : 'Video') + ' quitado del carrusel');
                    }}
                  >
                    <i className="bi bi-dash-circle me-2"></i>
                    Quitar del carrusel
                  </button>
                </div>
                <div>
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                    Cerrar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      if (activeMenu === 'images') {
                        setImages(prev => prev.filter(img => img !== selectedItem));
                      } else {
                        setVideos(prev => prev.filter(v => v !== selectedItem));
                      }
                      setShowModal(false);
                      showToast((activeMenu === 'images' ? 'Imagen' : 'Video') + ' eliminado de la galería');
                    }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Eliminar de galería
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Carrusel */}
      {showCarouselModal && (
  <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${carouselType === 'images' ? 'bi-images' : 'bi-film'} me-2`}></i>
                  Carrusel de {carouselType === 'images' ? 'Imágenes' : 'Videos'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCarouselModal(false)}></button>
              </div>
              <div className="modal-body">
                {carouselType === 'images' ? (
                  <Carousel interval={4000} controls indicators>
                    {carouselImages.map((img) => (
                      <Carousel.Item key={img.id}>
                        <img className="d-block w-100" src={img.src} alt={img.name} />
                        <Carousel.Caption>
                          <h6>{img.name}</h6>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <Carousel interval={6000} controls indicators>
                    {carouselVideos.map((vid) => (
                      <Carousel.Item key={vid.id}>
                        <div className="row justify-content-center">
                          <div className="col-lg-10">
                            <video className="w-100" controls>
                              <source src={vid.src} type={vid.info?.type || 'video/mp4'} />
                            </video>
                            <div className="text-center mt-2"><strong>{vid.name}</strong></div>
                          </div>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCarouselModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultimediaAdmin;