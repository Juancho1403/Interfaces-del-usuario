import React, { useState, useRef, useEffect } from 'react';
import './AdvancedImageEditor.css';

const AdvancedImageEditor = ({ onImageSave, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

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
          setCropArea({ x: 10, y: 10, width: 80, height: 80 });
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
      setCropArea({ x: 10, y: 10, width: 80, height: 80 });
    }
  };

  const toggleCrop = () => {
    setShowCrop(!showCrop);
  };

  // Funciones para el recorte interactivo
  const getMousePos = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (!showCrop) return;
    
    const pos = getMousePos(e);
    const handle = getResizeHandle(pos);
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else if (isInsideCropArea(pos)) {
      setIsDragging(true);
      setDragStart({ x: pos.x - cropArea.x, y: pos.y - cropArea.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!showCrop) return;
    
    const pos = getMousePos(e);
    
    if (isDragging) {
      const newX = Math.max(0, Math.min(100 - cropArea.width, pos.x - dragStart.x));
      const newY = Math.max(0, Math.min(100 - cropArea.height, pos.y - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      handleResize(pos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const isInsideCropArea = (pos) => {
    return pos.x >= cropArea.x && pos.x <= cropArea.x + cropArea.width &&
           pos.y >= cropArea.y && pos.y <= cropArea.y + cropArea.height;
  };

  const getResizeHandle = (pos) => {
    const handleSize = 10;
    const handles = {
      'nw': { x: cropArea.x, y: cropArea.y },
      'ne': { x: cropArea.x + cropArea.width, y: cropArea.y },
      'sw': { x: cropArea.x, y: cropArea.y + cropArea.height },
      'se': { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height }
    };

    for (const [handle, coords] of Object.entries(handles)) {
      if (Math.abs(pos.x - coords.x) <= handleSize && Math.abs(pos.y - coords.y) <= handleSize) {
        return handle;
      }
    }
    return null;
  };

  const handleResize = (pos) => {
    const minSize = 10;
    let newCropArea = { ...cropArea };

    switch (resizeHandle) {
      case 'nw':
        newCropArea.width = Math.max(minSize, cropArea.x + cropArea.width - pos.x);
        newCropArea.height = Math.max(minSize, cropArea.y + cropArea.height - pos.y);
        newCropArea.x = Math.min(cropArea.x + cropArea.width - minSize, pos.x);
        newCropArea.y = Math.min(cropArea.y + cropArea.height - minSize, pos.y);
        break;
      case 'ne':
        newCropArea.width = Math.max(minSize, pos.x - cropArea.x);
        newCropArea.height = Math.max(minSize, cropArea.y + cropArea.height - pos.y);
        newCropArea.y = Math.min(cropArea.y + cropArea.height - minSize, pos.y);
        break;
      case 'sw':
        newCropArea.width = Math.max(minSize, cropArea.x + cropArea.width - pos.x);
        newCropArea.height = Math.max(minSize, pos.y - cropArea.y);
        newCropArea.x = Math.min(cropArea.x + cropArea.width - minSize, pos.x);
        break;
      case 'se':
        newCropArea.width = Math.max(minSize, pos.x - cropArea.x);
        newCropArea.height = Math.max(minSize, pos.y - cropArea.y);
        break;
    }

    setCropArea(newCropArea);
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
        } else {
          const processedImageUrl = canvas.toDataURL();
          onImageSave(processedImageUrl, imageInfo);
        }
      };
      img.src = selectedImage;
    }
  };

  // Event listeners para el mouse
  useEffect(() => {
    if (showCrop && containerRef.current) {
      containerRef.current.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousedown', handleMouseDown);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [showCrop, cropArea, isDragging, isResizing, resizeHandle]);

  return (
    <div className="advanced-image-editor-modal">
      <div className="advanced-image-editor-content">
        <div className="advanced-image-editor-header">
          <h3>Editor Avanzado de Imágenes</h3>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>

        <div className="advanced-image-editor-body">
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
                <div 
                  className="image-container"
                  ref={containerRef}
                  style={{ cursor: showCrop ? 'crosshair' : 'default' }}
                >
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
                      <div className="crop-handle crop-handle-nw" data-handle="nw"></div>
                      <div className="crop-handle crop-handle-ne" data-handle="ne"></div>
                      <div className="crop-handle crop-handle-sw" data-handle="sw"></div>
                      <div className="crop-handle crop-handle-se" data-handle="se"></div>
                      <div className="crop-grid">
                        <div className="grid-line horizontal"></div>
                        <div className="grid-line horizontal"></div>
                        <div className="grid-line vertical"></div>
                        <div className="grid-line vertical"></div>
                      </div>
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
                  <div className="crop-instructions">
                    <div className="instruction-item">
                      <i className="fas fa-mouse-pointer"></i>
                      <span>Arrastra el área de recorte para moverla</span>
                    </div>
                    <div className="instruction-item">
                      <i className="fas fa-expand-arrows-alt"></i>
                      <span>Arrastra las esquinas para redimensionar</span>
                    </div>
                    <div className="instruction-item">
                      <i className="fas fa-arrows-alt"></i>
                      <span>Mantén Shift para mantener proporción</span>
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
                        <div className="info-item">
                          <strong>Proporción:</strong>
                          <span>{(cropArea.width / cropArea.height).toFixed(2)}:1</span>
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

export default AdvancedImageEditor;
