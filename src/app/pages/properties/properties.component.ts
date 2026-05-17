import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Properties } from '../../services/properties/properties';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner.component';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [CommonModule, FeaturedPropertiesComponent, CtaBannerComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {
  propertiesList: any[] = [];
  isSearchFiltered: boolean = false;
  searchRadiusKm: number = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: Properties
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lng = params['lng'];
      const rad = params['rad'];

      if (lat && lng) {
        this.isSearchFiltered = true;
        this.searchRadiusKm = Number(rad) || 2;
        this.loadPropertiesWithinRadius(Number(lat), Number(lng), this.searchRadiusKm);

        // Desplazarse suavemente y de forma directa a los resultados
        setTimeout(() => {
          const element = document.getElementById('propiedades');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } else {
        this.isSearchFiltered = false;
        this.loadAllProperties();
      }
    });
  }

  loadPropertiesWithinRadius(lat: number, lng: number, rad: number) {
    this.propertiesService.getPropertiesWithinRadius(lat, lng, rad).subscribe({
      next: (data: any[]) => {
        this.propertiesList = data;
      },
      error: (err: any) => {
        console.error('Error loading properties within radius:', err);
        // Fallback to loading all properties on error
        this.loadAllProperties();
      }
    });
  }

  loadAllProperties() {
    this.propertiesService.getAllProperties().subscribe({
      next: (data: any[]) => {
        this.propertiesList = data;
      },
      error: (err: any) => console.error('Error loading all properties:', err)
    });
  }

  clearSearchFilter() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { lat: null, lng: null, rad: null },
      queryParamsHandling: 'merge'
    });
  }
}
