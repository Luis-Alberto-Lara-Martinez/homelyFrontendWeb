import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Properties } from '../../services/properties/properties';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner.component';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FeaturedPropertiesComponent, CtaBannerComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {
  allProperties: any[] = [];
  propertiesList: any[] = [];
  isSearchFiltered: boolean = false;
  searchRadiusKm: number = 2;
  isLoading: boolean = true;

  // Filtros de búsqueda
  filterTransaction: string = '';
  filterType: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;
  filterBeds: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: Properties,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllProperties();
    
    setTimeout(() => {
      const element = document.getElementById('propiedades');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  loadAllProperties() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.propertiesService.getPropertiesWithinRadius(40.416775, -3.703790, 5000).subscribe({
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
        this.allProperties = list;
        this.applyFilters(); // Aplica los filtros iniciales (vacio)
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading all properties:', err);
        this.allProperties = [];
        this.propertiesList = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.propertiesList = this.allProperties.filter((prop: any) => {
      // 1. Filtrar por Operación (Venta / Alquiler)
      if (this.filterTransaction) {
        const propTrans = (prop.transaction || prop.operacion || prop.status || '').toLowerCase();
        if (propTrans !== this.filterTransaction.toLowerCase()) {
          return false;
        }
      }

      // 2. Filtrar por Tipo de Inmueble (Residencia, Garaje, etc)
      if (this.filterType) {
        const propType = (prop.type || prop.tipoVivienda || prop.residence?.type || '').toLowerCase();
        if (propType !== this.filterType.toLowerCase()) {
          return false;
        }
      }

      // 3. Filtrar por Precio
      const price = Number(prop.price) || 0;
      if (this.filterMinPrice !== null && price < this.filterMinPrice) {
        return false;
      }
      if (this.filterMaxPrice !== null && price > this.filterMaxPrice) {
        return false;
      }

      // 4. Filtrar por Habitaciones
      if (this.filterBeds) {
        const beds = Number(prop.residence?.bedrooms || prop.beds || prop.habitaciones) || 0;
        const requiredBeds = Number(this.filterBeds);
        
        if (requiredBeds === 4) {
          if (beds < 4) return false;
        } else {
          if (beds !== requiredBeds) return false;
        }
      }

      return true;
    });
    this.cdr.detectChanges();
  }

  resetFilters() {
    this.filterTransaction = '';
    this.filterType = '';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.filterBeds = '';
    this.applyFilters();
  }
}
