import React, { createContext, useContext, useState, useEffect } from 'react';
import carousel1 from '../assets/carousel-1.jpg';
import carousel2 from '../assets/carousel-2.jpg';

const CarouselContext = createContext();

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
};

export const CarouselProvider = ({ children }) => {
  const [carouselImages, setCarouselImages] = useState(() => {
    const saved = localStorage.getItem('carouselImages');
    if (saved) {
      return JSON.parse(saved);
    }
    // Imágenes por defecto
    return [
      { 
        id: 1, 
        src: carousel1, 
        name: 'carousel-1.jpg',
        isDefault: true
      },
      { 
        id: 2, 
        src: carousel2, 
        name: 'carousel-2.jpg',
        isDefault: true
      }
    ];
  });

  const [carouselVideos, setCarouselVideos] = useState(() => {
    const saved = localStorage.getItem('carouselVideos');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
  }, [carouselImages]);

  useEffect(() => {
    localStorage.setItem('carouselVideos', JSON.stringify(carouselVideos));
  }, [carouselVideos]);

  const addCarouselImage = (imageUrl, imageInfo) => {
    const newImage = {
      id: Date.now(),
      src: imageUrl,
      name: `edited_${imageInfo.name}`,
      info: imageInfo,
      isDefault: false
    };
    setCarouselImages(prev => [...prev, newImage]);
  };

  const addCarouselVideo = (videoUrl, videoInfo) => {
    const newVideo = {
      id: Date.now(),
      src: videoUrl,
      name: videoInfo.name,
      info: videoInfo,
      isDefault: false
    };
    setCarouselVideos(prev => [...prev, newVideo]);
  };

  const removeCarouselImage = (imageId) => {
    setCarouselImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeCarouselVideo = (videoId) => {
    setCarouselVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const getCarouselImages = () => {
    return carouselImages;
  };

  const getCarouselVideos = () => {
    return carouselVideos;
  };

  const value = {
    carouselImages,
    carouselVideos,
    addCarouselImage,
    addCarouselVideo,
    removeCarouselImage,
    removeCarouselVideo,
    getCarouselImages,
    getCarouselVideos
  };

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
};
