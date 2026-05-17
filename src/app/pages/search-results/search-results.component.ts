import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Properties } from '../../services/properties/properties';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FeaturedPropertiesComponent, CtaBannerComponent],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  propertiesList: any[] = [];
  searchRadiusKm: number = 2;
  isLoading: boolean = true;
  hasValidCoords: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: Properties,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lng = params['lng'];
      const rad = params['rad'];

      this.hasValidCoords = lat !== undefined && lat !== null && lat !== 'null' && 
                            lng !== undefined && lng !== null && lng !== 'null' &&
                            !isNaN(Number(lat)) && !isNaN(Number(lng));

      if (this.hasValidCoords) {
        this.searchRadiusKm = Number(rad) || 2;
        this.loadPropertiesWithinRadius(Number(lat), Number(lng), this.searchRadiusKm);

        setTimeout(() => {
          const element = document.getElementById('search-results-top');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } else {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPropertiesWithinRadius(lat: number, lng: number, rad: number) {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.propertiesService.getPropertiesWithinRadius(lat, lng, rad).subscribe({
      next: (data: any) => {
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.data)) {
          list = data.data;
        } else if (data && Array.isArray(data.properties)) {
          list = data.properties;
        } else if (data && Array.isArray(data.content)) {
          list = data.content;
        }
        this.propertiesList = list;
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar renderizado
      },
      error: (err: any) => {
        console.error('Error loading properties within radius:', err);
        this.propertiesList = [];
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar renderizado
      }
    });
  }

  goToCatalog() {
    this.router.navigate(['/propiedades']);
  }
}
