import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ImageEditor.css';

const ImageEditor = ({ onImageSave, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageInfo({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            extension: file.name.split('.').pop().toUpperCase(),
            originalWidth: img.width,
            originalHeight: img.height,
            type: file.type
          });
          setOriginalImage(e.target.result);
          setSelectedImage(e.target.result);
          setRotation(0);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const [croppedPreview, setCroppedPreview] = useState(null);

  const handleCrop = useCallback(() => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const croppedImageUrl = canvas.toDataURL();
        canvas.toBlob((blob) => {
          const size = (blob.size / 1024 / 1024).toFixed(2);
          setImageInfo(prev => ({ 
            ...prev, 
            croppedWidth: canvas.width,
            croppedHeight: canvas.height,
            croppedSize: size + ' MB'
          }));
        });
        setCroppedPreview(croppedImageUrl);
        return croppedImageUrl;
      }
    }
    return null;
  }, [cropper, imageInfo]);

  const rotateLeft = () => {
    if (cropper && cropper.rotate) {
      cropper.rotate(-90);
      setRotation(prev => prev - 90);
    }
  };

  const rotateRight = () => {
    if (cropper && cropper.rotate) {
      cropper.rotate(90);
      setRotation(prev => prev + 90);
    }
  };

  const resetImage = () => {
    if (originalImage) {
      setSelectedImage(originalImage);
      setRotation(0);
      if (cropper) {
        cropper.reset();
      }
    }
  };

  const downloadImage = () => {
    const croppedImageUrl = handleCrop();
    if (croppedImageUrl) {
      const link = document.createElement('a');
      link.download = `cropped_${imageInfo.name}`;
      link.href = croppedImageUrl;
      link.click();
    }
  };

  const saveToCarousel = () => {
    const croppedImageUrl = handleCrop();
    if (croppedImageUrl && onImageSave) {
      onImageSave(croppedImageUrl, imageInfo);
    }
  };

  const cropperOptions = {
    aspectRatio: 16 / 9,
    viewMode: 2,
    dragMode: 'move',
    autoCropArea: 1,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
  };

  return (
    <div className="image-editor-modal">
      <div className="image-editor-content">
        <div className="image-editor-header">
          <h3>Editor de Imágenes</h3>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>

        <div className="image-editor-body">
          {!selectedImage ? (
            <div className="upload-area">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fas fa-upload me-2"></i>
                Seleccionar Imagen
              </button>
            </div>
          ) : (
            <div className="editor-container">
              <div className="editor-main">
                <div className="cropper-container">
                  <Cropper
                    src={selectedImage}
                    style={{ height: 400, width: '100%' }}
                    onInitialized={(instance) => setCropper(instance)}
                    {...cropperOptions}
                  />
                </div>
                
                <div className="editor-controls">
                  <div className="control-group">
                    <button className="btn btn-outline-primary" onClick={rotateLeft}>
                      <i className="fas fa-undo"></i> Rotar Izquierda
                    </button>
                    <button className="btn btn-outline-primary" onClick={rotateRight}>
                      <i className="fas fa-redo"></i> Rotar Derecha
                    </button>
                    <button className="btn btn-outline-secondary" onClick={resetImage}>
                      <i className="fas fa-refresh"></i> Reiniciar
                    </button>
                  </div>
                  
                  <div className="control-group">
                    <button className="btn btn-success" onClick={downloadImage}>
                      <i className="fas fa-download"></i> Descargar
                    </button>
                    <button className="btn btn-primary" onClick={saveToCarousel}>
                      <i className="fas fa-save"></i> Guardar en Carrusel
                    </button>
                  </div>
                </div>
              </div>

              <div className="image-info-panel">
                <h5>Información de la Imagen</h5>
                {imageInfo && (
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Nombre:</strong>
                      <span>{imageInfo.name}</span>
                    </div>
                    <div className="info-item">
                      <strong>Extensión:</strong>
                      <span>{imageInfo.extension}</span>
                    </div>
                    <div className="info-item">
                      <strong>Tamaño Original:</strong>
                      <span>{imageInfo.size}</span>
                    </div>
                    <div className="info-item">
                      <strong>Dimensiones Originales:</strong>
                      <span>{imageInfo.originalWidth} × {imageInfo.originalHeight}</span>
                    </div>
                    {imageInfo.croppedWidth && (
                      <>
                        <div className="info-item">
                          <strong>Tamaño Recortado:</strong>
                          <span>{imageInfo.croppedSize || 'Calculando...'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Dimensiones Recortadas:</strong>
                          <span>{imageInfo.croppedWidth} × {imageInfo.croppedHeight}</span>
                        </div>
                      </>
                    )}
                    <div className="info-item">
                      <strong>Rotación:</strong>
                      <span>{rotation}°</span>
                    </div>
                  </div>
                )}

                <div className="preview-section">
                  <h6>Vista Previa</h6>
                  <div className="preview-container">
                    {selectedImage && (
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="preview-image"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      />
                    )}
                  </div>
                </div>

                <div className="result-section">
                  <h6>Resultado Final</h6>
                  <div className="result-container">
                    <button 
                      className="btn btn-sm btn-outline-primary mb-2"
                      onClick={handleCrop}
                    >
                      Generar Vista Previa del Recorte
                    </button>
                    <div className="cropped-preview">
                      {croppedPreview ? (
                        <img 
                          src={croppedPreview} 
                          alt="Cropped Preview" 
                          className="preview-image"
                        />
                      ) : (
                        <span>Haz clic en "Generar Vista Previa" para ver el resultado</span>
                      )}
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

export default ImageEditor;
