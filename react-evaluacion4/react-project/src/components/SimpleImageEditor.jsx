import React, { useState, useRef } from 'react';
import './SimpleImageEditor.css';

const SimpleImageEditor = ({ onImageSave, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

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
          setShowCrop(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const rotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const resetImage = () => {
    if (originalImage) {
      setSelectedImage(originalImage);
      setRotation(0);
      setShowCrop(false);
    }
  };

  const toggleCrop = () => {
    setShowCrop(!showCrop);
  };

  const downloadImage = () => {
    if (selectedImage) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Aplicar rotación
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        
        // Aplicar recorte si está activo
        if (showCrop) {
          const croppedCanvas = document.createElement('canvas');
          const croppedCtx = croppedCanvas.getContext('2d');
          const cropX = (cropArea.x / 100) * canvas.width;
          const cropY = (cropArea.y / 100) * canvas.height;
          const cropWidth = (cropArea.width / 100) * canvas.width;
          const cropHeight = (cropArea.height / 100) * canvas.height;
          
          croppedCanvas.width = cropWidth;
          croppedCanvas.height = cropHeight;
          croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
          
          const link = document.createElement('a');
          link.download = `edited_${imageInfo.name}`;
          link.href = croppedCanvas.toDataURL();
          link.click();
        } else {
          const link = document.createElement('a');
          link.download = `edited_${imageInfo.name}`;
          link.href = canvas.toDataURL();
          link.click();
        }
      };
      img.src = selectedImage;
    }
  };

  const saveToCarousel = () => {
    if (selectedImage && onImageSave) {
      // Crear imagen procesada
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Aplicar rotación
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        
        // Aplicar recorte si está activo
        if (showCrop) {
          const croppedCanvas = document.createElement('canvas');
          const croppedCtx = croppedCanvas.getContext('2d');
          const cropX = (cropArea.x / 100) * canvas.width;
          const cropY = (cropArea.y / 100) * canvas.height;
          const cropWidth = (cropArea.width / 100) * canvas.width;
          const cropHeight = (cropArea.height / 100) * canvas.height;
          
          croppedCanvas.width = cropWidth;
          croppedCanvas.height = cropHeight;
          croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
          
                     const processedImageUrl = croppedCanvas.toDataURL();
           croppedCanvas.toBlob((blob) => {
             const updatedInfo = {
               ...imageInfo,
               croppedWidth: cropWidth,
               croppedHeight: cropHeight,
               croppedSize: (blob.size / 1024 / 1024).toFixed(2) + ' MB'
             };
             onImageSave(processedImageUrl, updatedInfo);
           });
          onImageSave(processedImageUrl, updatedInfo);
        } else {
          const processedImageUrl = canvas.toDataURL();
          onImageSave(processedImageUrl, imageInfo);
        }
      };
      img.src = selectedImage;
    }
  };

  const handleCropChange = (e) => {
    const { name, value } = e.target;
    setCropArea(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="simple-image-editor-modal">
      <div className="simple-image-editor-content">
        <div className="simple-image-editor-header">
          <h3>Editor de Imágenes</h3>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>

        <div className="simple-image-editor-body">
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
                <div className="image-container">
                  <img 
                    ref={imageRef}
                    src={selectedImage} 
                    alt="Preview" 
                    className="preview-image"
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      maxWidth: '100%',
                      maxHeight: '400px'
                    }}
                  />
                  {showCrop && (
                    <div 
                      className="crop-overlay"
                      style={{
                        left: `${cropArea.x}%`,
                        top: `${cropArea.y}%`,
                        width: `${cropArea.width}%`,
                        height: `${cropArea.height}%`
                      }}
                    >
                      <div className="crop-handle crop-handle-nw"></div>
                      <div className="crop-handle crop-handle-ne"></div>
                      <div className="crop-handle crop-handle-sw"></div>
                      <div className="crop-handle crop-handle-se"></div>
                    </div>
                  )}
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
                    <button className="btn btn-outline-info" onClick={toggleCrop}>
                      <i className="fas fa-crop"></i> {showCrop ? 'Ocultar Recorte' : 'Mostrar Recorte'}
                    </button>
                    <button className="btn btn-success" onClick={downloadImage}>
                      <i className="fas fa-download"></i> Descargar
                    </button>
                    <button className="btn btn-primary" onClick={saveToCarousel}>
                      <i className="fas fa-save"></i> Guardar en Carrusel
                    </button>
                  </div>
                </div>

                {showCrop && (
                  <div className="crop-controls">
                    <h6>Controles de Recorte</h6>
                    <div className="crop-sliders">
                      <div className="slider-group">
                        <label>X: {cropArea.x.toFixed(1)}%</label>
                        <input
                          type="range"
                          name="x"
                          min="0"
                          max="100"
                          value={cropArea.x}
                          onChange={handleCropChange}
                        />
                      </div>
                      <div className="slider-group">
                        <label>Y: {cropArea.y.toFixed(1)}%</label>
                        <input
                          type="range"
                          name="y"
                          min="0"
                          max="100"
                          value={cropArea.y}
                          onChange={handleCropChange}
                        />
                      </div>
                      <div className="slider-group">
                        <label>Ancho: {cropArea.width.toFixed(1)}%</label>
                        <input
                          type="range"
                          name="width"
                          min="10"
                          max="100"
                          value={cropArea.width}
                          onChange={handleCropChange}
                        />
                      </div>
                      <div className="slider-group">
                        <label>Alto: {cropArea.height.toFixed(1)}%</label>
                        <input
                          type="range"
                          name="height"
                          min="10"
                          max="100"
                          value={cropArea.height}
                          onChange={handleCropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                    {showCrop && (
                      <>
                        <div className="info-item">
                          <strong>Área de Recorte:</strong>
                          <span>{cropArea.width.toFixed(1)}% × {cropArea.height.toFixed(1)}%</span>
                        </div>
                        <div className="info-item">
                          <strong>Posición:</strong>
                          <span>X: {cropArea.x.toFixed(1)}%, Y: {cropArea.y.toFixed(1)}%</span>
                        </div>
                      </>
                    )}
                    <div className="info-item">
                      <strong>Rotación:</strong>
                      <span>{rotation}°</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleImageEditor;
