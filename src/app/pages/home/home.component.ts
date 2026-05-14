import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { environment } from '../../../enviroments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    StatsComponent,
    TestimonialsComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  ngOnInit() {
    console.log(environment.googleClientId);
    console.log(environment.microsoftClientId);
  }
}
