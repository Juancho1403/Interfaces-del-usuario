import React, { useState, useRef, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ images, onRemoveImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const imageRef = useRef(null);
  const carouselRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (images.length === 0) return;
    
    // Reset zoom and position when changing images
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const handleDeleteImage = (imageId, imageName) => {
    setShowDeleteConfirm({ id: imageId, name: imageName });
  };

  const confirmDeleteImage = () => {
    if (showDeleteConfirm && onRemoveImage) {
      onRemoveImage(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
      
      // Si eliminamos la imagen actual, ir al siguiente o al primero
      if (showDeleteConfirm.id === images[currentIndex]?.id) {
        if (images.length > 1) {
          setCurrentIndex(prev => prev === 0 ? 0 : prev - 1);
        }
      }
    }
  };

  const cancelDeleteImage = () => {
    setShowDeleteConfirm(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      carouselRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMoveDrag = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setImagePosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyPress = (e) => {
    switch(e.key) {
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'Escape':
        if (isFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        handleResetZoom();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousemove', handleMouseMoveDrag);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousemove', handleMouseMoveDrag);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, zoomLevel, imagePosition]);

  if (images.length === 0) {
    return (
      <div className="image-carousel-empty">
        <div className="empty-content">
          <i className="bi bi-images"></i>
          <h5>No hay imágenes en el carrusel</h5>
          <p>Agrega imágenes desde la galería para verlas aquí</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      className={`image-carousel-container ${isFullscreen ? 'fullscreen' : ''}`}
      ref={carouselRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(true)}
    >
      <div className="carousel-header">
        <h5>Imágenes en Carrusel ({images.length})</h5>
        <div className="carousel-controls">
          <div className="carousel-info">
            <span>Imagen {currentIndex + 1} de {images.length}</span>
          </div>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowThumbnails(!showThumbnails)}
          >
            <i className={`bi ${showThumbnails ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            {showThumbnails ? 'Ocultar' : 'Mostrar'} Miniaturas
          </button>
        </div>
      </div>

      <div className="main-image-section">
        <div className="image-viewer-container">
          <div 
            className="image-container"
            onMouseDown={handleMouseDown}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              ref={imageRef}
              src={currentImage.src}
              alt={currentImage.name}
              className="main-image"
              style={{
                transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
            />
          </div>
          
          {/* Overlay de controles */}
          <div className={`image-overlay ${showControls ? 'show' : ''}`}>
            <div className="zoom-controls">
              <button className="control-btn" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
                <i className="bi bi-zoom-out"></i>
              </button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="control-btn" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
                <i className="bi bi-zoom-in"></i>
              </button>
              <button className="control-btn" onClick={handleResetZoom}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>

          {/* Controles de navegación */}
          <div className={`navigation-controls ${showControls ? 'show' : ''}`}>
            <button 
              className="nav-btn prev-btn" 
              onClick={prevImage}
              disabled={images.length <= 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="nav-btn next-btn" 
              onClick={nextImage}
              disabled={images.length <= 1}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          {/* Controles de imagen */}
          <div className={`image-controls ${showControls ? 'show' : ''}`}>
            <div className="controls-row">
              <div className="left-controls">
                <button className="control-btn" onClick={prevImage}>
                  <i className="bi bi-skip-backward"></i>
                </button>
                <button className="control-btn" onClick={nextImage}>
                  <i className="bi bi-skip-forward"></i>
                </button>
              </div>

              <div className="right-controls">
                <button 
                  className="control-btn delete-btn"
                  onClick={handleDeleteImage}
                  disabled={currentImage.isDefault}
                  title={currentImage.isDefault ? 'No se puede eliminar imagen por defecto' : 'Eliminar imagen'}
                >
                  <i className="bi bi-trash"></i>
                </button>
                <button className="control-btn" onClick={toggleFullscreen}>
                  <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="image-info">
          <h6 className="image-title">{currentImage.name}</h6>
          <div className="image-details">
            <span className="detail-item">
              <i className="bi bi-image"></i>
              Tipo: {currentImage.isDefault ? 'Imagen por defecto' : 'Agregada por usuario'}
            </span>
            <span className="detail-item">
              <i className="bi bi-zoom-in"></i>
              Zoom: {Math.round(zoomLevel * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Miniaturas de imágenes */}
      {showThumbnails && (
        <div className="thumbnails-section">
          <h6>Imágenes Disponibles</h6>
          <div className="thumbnails-container">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              >
                <div className="thumbnail-image">
                  <img src={image.src} alt={image.name} />
                  <div className="thumbnail-overlay">
                    <div className="thumbnail-info">
                      <span className="image-number">{index + 1}</span>
                      <span className="image-name">{image.name}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(image.id, 'image');
                      }}
                      disabled={image.isDefault}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicadores de progreso */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToImage(index)}
          />
        ))}
      </div>

      {/* Controles de teclado info */}
      <div className="keyboard-info">
        <small>
          <strong>Controles:</strong> ← → (Navegar) | F (Pantalla completa) | +/- (Zoom) | 0 (Reset) | ESC (Salir)
        </small>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h5>Confirmar Eliminación</h5>
            </div>
            <div className="delete-modal-body">
              <p>¿Estás seguro de que quieres eliminar la imagen "{currentImage.name}" del carrusel?</p>
              <p className="text-muted">Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={cancelDeleteImage}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmDeleteImage}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
