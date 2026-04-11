import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner.component';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [CommonModule, FeaturedPropertiesComponent, CtaBannerComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent {}
