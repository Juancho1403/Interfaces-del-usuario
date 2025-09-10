import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarouselService } from '../../services/carousel.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  testimonialIndex = 0;
  aboutData: any = null;
  isLoading = true;
  showWelcome = true;
  carouselImages: any[] = [];
  carouselVideos: any[] = [];

  destinations = [
    { name: 'United States', cities: 100, img: 'assets/destination-1.jpg' },
    { name: 'United Kingdom', cities: 100, img: 'assets/destination-2.jpg' },
    { name: 'Australia', cities: 100, img: 'assets/destination-3.jpg' },
    { name: 'India', cities: 100, img: 'assets/destination-4.jpg' },
    { name: 'South Africa', cities: 100, img: 'assets/destination-5.jpg' },
    { name: 'Indonesia', cities: 100, img: 'assets/destination-6.jpg' },
  ];

  services = [
    { icon: 'fa fa-route', title: 'Travel Guide', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
    { icon: 'fa fa-ticket-alt', title: 'Ticket Booking', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
    { icon: 'fa fa-hotel', title: 'Hotel Booking', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
  ];

  packages = [
    { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: 'assets/package-1.jpg' },
    { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: 'assets/package-2.jpg' },
    { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: 'assets/package-3.jpg' },
    { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: 'assets/package-4.jpg' },
    { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: 'assets/package-5.jpg' },
    { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: 'assets/package-6.jpg' },
  ];

  guides = [
    { img: 'assets/team-1.jpg' },
    { img: 'assets/team-2.jpg' },
    { img: 'assets/team-3.jpg' },
    { img: 'assets/team-4.jpg' },
  ];

  testimonials = [
    { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: 'assets/testimonial-1.jpg' },
    { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: 'assets/testimonial-2.jpg' },
    { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: 'assets/testimonial-3.jpg' },
    { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: 'assets/testimonial-4.jpg' },
  ];

  blogs = [
    { img: 'assets/blog-1.jpg' },
    { img: 'assets/blog-2.jpg' },
    { img: 'assets/blog-3.jpg' },
  ];

  constructor(
    private router: Router,
    private carouselService: CarouselService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadCarouselData();
    this.fetchAboutData();
    
    // Hide welcome message after 3 seconds
    setTimeout(() => {
      this.showWelcome = false;
    }, 3000);
  }

  private loadCarouselData(): void {
    this.carouselService.carouselImages$.subscribe(images => {
      this.carouselImages = images;
    });
    
    this.carouselService.carouselVideos$.subscribe(videos => {
      this.carouselVideos = videos;
    });
  }

  private async fetchAboutData(): Promise<void> {
    try {
      this.aboutData = await this.apiService.getAboutData().toPromise();
    } catch (error) {
      // Use default data if API fails
      this.aboutData = {
        title: "Sobre Nosotros",
        subtitle: "Descubre nuestra historia y misión",
        description: "Somos una empresa comprometida con la excelencia y la innovación.",
        features: [
          { title: "Experiencia", description: "Más de 10 años en el mercado" },
          { title: "Calidad", description: "Servicios de alta calidad garantizados" },
          { title: "Innovación", description: "Tecnología de vanguardia" }
        ]
      };
    } finally {
      this.isLoading = false;
    }
  }

  nextTestimonial(): void {
    this.testimonialIndex = (this.testimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.testimonialIndex = this.testimonialIndex === 0 ? this.testimonials.length - 1 : this.testimonialIndex - 1;
  }

  removeCarouselImage(imageId: number): void {
    this.carouselService.removeCarouselImage(imageId);
  }

  removeCarouselVideo(videoId: number): void {
    this.carouselService.removeCarouselVideo(videoId);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
