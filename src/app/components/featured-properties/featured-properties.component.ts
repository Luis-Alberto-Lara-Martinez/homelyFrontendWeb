import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-featured-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-properties.component.html'
})
export class FeaturedPropertiesComponent {}
