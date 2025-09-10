import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselService } from '../../services/carousel.service';
import { CarouselItem, CarouselVideo } from '../../models/multimedia.model';

@Component({
  selector: 'app-multimedia-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multimedia-admin.component.html',
  styleUrl: './multimedia-admin.component.css'
})
export class MultimediaAdminComponent implements OnInit {
  carouselImages: CarouselItem[] = [];
  carouselVideos: CarouselVideo[] = [];

  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.carouselService.carouselImages$.subscribe(images => {
      this.carouselImages = images;
    });

    this.carouselService.carouselVideos$.subscribe(videos => {
      this.carouselVideos = videos;
    });
  }

  removeImage(imageId: number): void {
    this.carouselService.removeCarouselImage(imageId);
  }

  removeVideo(videoId: number): void {
    this.carouselService.removeCarouselVideo(videoId);
  }
}
