import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
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
  filterSort: string = '';

  // Estado para Dropdowns personalizados
  activeDropdown: string | null = null;

  transactionOptions = [
    { label: 'Cualquiera', value: '' },
    { label: 'Venta', value: 'venta' },
    { label: 'Alquiler', value: 'alquiler' }
  ];

  typeOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Residencia', value: 'residencia' },
    { label: 'Local Comercial', value: 'local' },
    { label: 'Oficina', value: 'oficina' },
    { label: 'Garaje', value: 'garaje' },
    { label: 'Trastero', value: 'trastero' }
  ];

  bedsOptions = [
    { label: 'Cualquiera', value: '' },
    { label: '1 Habitación', value: '1' },
    { label: '2 Habitaciones', value: '2' },
    { label: '3 Habitaciones', value: '3' },
    { label: '4+ Habitaciones', value: '4' }
  ];

  sortOptions = [
    { label: 'Destacados', value: '' },
    { label: 'Precio: menor a mayor', value: 'price_asc' },
    { label: 'Precio: mayor a menor', value: 'price_desc' },
    { label: 'Habitaciones: más a menos', value: 'beds_desc' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: Properties,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('document:click')
  onDocumentClick() {
    // Cerrar cualquier dropdown abierto si se hace clic fuera
    this.activeDropdown = null;
  }

  toggleDropdown(dropdownName: string, event: Event) {
    event.stopPropagation();
    if (this.activeDropdown === dropdownName) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = dropdownName;
    }
  }

  selectOption(filterName: string, value: string, event: Event) {
    event.stopPropagation();
    if (filterName === 'transaction') {
      this.filterTransaction = value;
    } else if (filterName === 'type') {
      this.filterType = value;
    } else if (filterName === 'beds') {
      this.filterBeds = value;
    } else if (filterName === 'sort') {
      this.filterSort = value;
    }
    this.activeDropdown = null;
    this.applyFilters();
  }

  getDisplayValue(filterName: string): string {
    if (filterName === 'transaction') {
      return this.transactionOptions.find(o => o.value === this.filterTransaction)?.label || 'Cualquiera';
    } else if (filterName === 'type') {
      return this.typeOptions.find(o => o.value === this.filterType)?.label || 'Todos los tipos';
    } else if (filterName === 'beds') {
      return this.bedsOptions.find(o => o.value === this.filterBeds)?.label || 'Cualquiera';
    } else if (filterName === 'sort') {
      return this.sortOptions.find(o => o.value === this.filterSort)?.label || 'Destacados';
    }
    return '';
  }

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
    let filtered = this.allProperties.filter((prop: any) => {
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

    // 5. Aplicar ordenación
    if (this.filterSort) {
      filtered.sort((a: any, b: any) => {
        if (this.filterSort === 'price_asc') {
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        } else if (this.filterSort === 'price_desc') {
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        } else if (this.filterSort === 'beds_desc') {
          const bedsA = Number(a.residence?.bedrooms || a.beds || a.habitaciones) || 0;
          const bedsB = Number(b.residence?.bedrooms || b.beds || b.habitaciones) || 0;
          return bedsB - bedsA;
        }
        return 0;
      });
    }

    this.propertiesList = filtered;
    this.cdr.detectChanges();
  }

  resetFilters() {
    this.filterTransaction = '';
    this.filterType = '';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.filterBeds = '';
    this.filterSort = '';
    this.applyFilters();
  }
}
