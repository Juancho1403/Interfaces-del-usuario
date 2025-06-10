import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { About } from '../about/about';
import { Features } from '../features/features';
import { Service } from '../service-component/service';
import { Team } from '../team/team';
@Component({
  selector: 'app-home-page',
  imports: [Banner,  About, Features,  Service,  Team,  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
