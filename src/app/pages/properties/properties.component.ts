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
    // Como esta página ahora es solo para el catálogo completo, 
    // cargamos directamente todas las propiedades.
    this.loadAllProperties();
    
    // Desplazarse suavemente al inicio
    setTimeout(() => {
      const element = document.getElementById('propiedades');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  loadAllProperties() {
    this.propertiesService.getAllProperties().subscribe({
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
      },
      error: (err: any) => console.error('Error loading all properties:', err)
    });
  }
}
