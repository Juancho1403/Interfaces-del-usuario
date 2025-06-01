import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { Booking } from '../booking/booking';
import { About } from '../about/about';
import { Features } from '../features/features';

@Component({
  selector: 'app-home-page',
  imports: [Banner, Booking, About, Features],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
