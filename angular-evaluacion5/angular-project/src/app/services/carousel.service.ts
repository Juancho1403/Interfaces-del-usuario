import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarouselItem, CarouselVideo } from '../models/multimedia.model';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private carouselImagesSubject = new BehaviorSubject<CarouselItem[]>([]);
  private carouselVideosSubject = new BehaviorSubject<CarouselVideo[]>([]);

  public carouselImages$ = this.carouselImagesSubject.asObservable();
  public carouselVideos$ = this.carouselVideosSubject.asObservable();

  constructor() {
    this.loadCarouselData();
  }

  private loadCarouselData(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Load images from localStorage
      const savedImages = localStorage.getItem('carouselImages');
      if (savedImages) {
        try {
          const images = JSON.parse(savedImages);
          this.carouselImagesSubject.next(images);
        } catch (error) {
          this.setDefaultImages();
        }
      } else {
        this.setDefaultImages();
      }

      // Load videos from localStorage
      const savedVideos = localStorage.getItem('carouselVideos');
      if (savedVideos) {
        try {
          const videos = JSON.parse(savedVideos);
          this.carouselVideosSubject.next(videos);
        } catch (error) {
          this.carouselVideosSubject.next([]);
        }
      }
    } else {
      // Set default images if not in browser
      this.setDefaultImages();
    }
  }

  private setDefaultImages(): void {
    const defaultImages: CarouselItem[] = [
      {
        id: 1,
        src: 'assets/carousel-1.jpg',
        name: 'carousel-1.jpg',
        isDefault: true
      },
      {
        id: 2,
        src: 'assets/carousel-2.jpg',
        name: 'carousel-2.jpg',
        isDefault: true
      }
    ];
    this.carouselImagesSubject.next(defaultImages);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carouselImages', JSON.stringify(defaultImages));
    }
  }

  addCarouselImage(imageUrl: string, imageInfo: any): void {
    const newImage: CarouselItem = {
      id: Date.now(),
      src: imageUrl,
      name: `edited_${imageInfo.name}`,
      info: imageInfo,
      isDefault: false
    };

    const currentImages = this.carouselImagesSubject.value;
    const updatedImages = [...currentImages, newImage];
    
    this.carouselImagesSubject.next(updatedImages);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carouselImages', JSON.stringify(updatedImages));
    }
  }

  addCarouselVideo(videoUrl: string, videoInfo: any): void {
    const newVideo: CarouselVideo = {
      id: Date.now(),
      src: videoUrl,
      name: videoInfo.name,
      info: videoInfo,
      isDefault: false,
      subtitles: videoInfo.subtitles || []
    };

    const currentVideos = this.carouselVideosSubject.value;
    const updatedVideos = [...currentVideos, newVideo];
    
    this.carouselVideosSubject.next(updatedVideos);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carouselVideos', JSON.stringify(updatedVideos));
    }
  }

  removeCarouselImage(imageId: number): void {
    const currentImages = this.carouselImagesSubject.value;
    const updatedImages = currentImages.filter(img => img.id !== imageId);
    
    this.carouselImagesSubject.next(updatedImages);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carouselImages', JSON.stringify(updatedImages));
    }
  }

  removeCarouselVideo(videoId: number): void {
    const currentVideos = this.carouselVideosSubject.value;
    const updatedVideos = currentVideos.filter(video => video.id !== videoId);
    
    this.carouselVideosSubject.next(updatedVideos);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carouselVideos', JSON.stringify(updatedVideos));
    }
  }

  getCarouselImages(): CarouselItem[] {
    return this.carouselImagesSubject.value;
  }

  getCarouselVideos(): CarouselVideo[] {
    return this.carouselVideosSubject.value;
  }
}
