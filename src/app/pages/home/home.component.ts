import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { MortgageCtaComponent } from '../../components/mortgage-cta/mortgage-cta.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    StatsComponent,
    TestimonialsComponent,
    MortgageCtaComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent { }
