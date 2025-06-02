import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { Booking } from '../booking/booking';
import { About } from '../about/about';
import { Features } from '../features/features';
import { Destination } from '../destination/destination';
import { Service } from '../service/service';
import { Packages } from '../packages/packages';
import { Registration } from '../registration/registration';
import { Team } from '../team/team';
import { Testimonial } from '../testimonial/testimonial';
import { Blog } from '../blog/blog';
import { Footer } from '../footer/footer';
@Component({
  selector: 'app-home-page',
  imports: [Banner, Booking, About, Features, Destination, Service,Packages, Registration, Team, Testimonial, Blog, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
