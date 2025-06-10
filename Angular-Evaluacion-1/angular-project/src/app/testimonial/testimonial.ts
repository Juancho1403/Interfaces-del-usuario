import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial.html',
  styleUrls: ['./testimonial.css']
})
export class Testimonial implements AfterViewInit {
  testimonials = [
    {
      img: 'assets/img/testimonial-1.jpg',
      text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
      name: 'Client Name',
      profession: 'Profession'
    },
    {
      img: 'assets/img/testimonial-2.jpg',
      text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
      name: 'Client Name',
      profession: 'Profession'
    },
    {
      img: 'assets/img/testimonial-3.jpg',
      text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
      name: 'Client Name',
      profession: 'Profession'
    },
    {
      img: 'assets/img/testimonial-4.jpg',
      text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
      name: 'Client Name',
      profession: 'Profession'
    }
  ];

  ngAfterViewInit(): void {
    $('.testimonial-carousel').owlCarousel({
      autoplay: true,
      autoplayTimeout: 10000, // 10 segundos
      smartSpeed: 1000,
      margin: 25,
      dots: true,
      nav: true,
      loop: true,
      navText: [
        '<i class="fa fa-chevron-left"></i>',
        '<i class="fa fa-chevron-right"></i>'
      ],
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });

    // Centrar los botones de navegación con CSS
    $('.testimonial-carousel .owl-nav').css({
      'display': 'flex',
      'justify-content': 'center',
      'margin-top': '20px'
    });
  }
}
