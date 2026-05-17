import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Properties } from '../../services/properties/properties';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FeaturedPropertiesComponent, CtaBannerComponent],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  allProperties: any[] = [];
  propertiesList: any[] = [];
  searchRadiusKm: number = 2;
  isLoading: boolean = true;
  hasValidCoords: boolean = false;

  // Filtros de búsqueda
  filterTransaction: string = '';
  filterType: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;
  filterBeds: string = '';
  filterSort: string = '';

  // Filtros adicionales toggle y parámetros
  showExtraFilters: boolean = false;
  filterBaths: string = '';
  filterMinSize: number | null = null;
  filterMaxSize: number | null = null;
  filterHasPool: boolean = false;
  filterHasGarden: boolean = false;
  filterHasTerrace: boolean = false;
  filterHasElevator: boolean = false;
  filterHasAC: boolean = false;

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

  bathsOptions = [
    { label: 'Cualquiera', value: '' },
    { label: '1 Baño', value: '1' },
    { label: '2 Baños', value: '2' },
    { label: '3+ Baños', value: '3' }
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
    } else if (filterName === 'baths') {
      this.filterBaths = value;
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
    } else if (filterName === 'baths') {
      return this.bathsOptions.find(o => o.value === this.filterBaths)?.label || 'Cualquiera';
    } else if (filterName === 'sort') {
      return this.sortOptions.find(o => o.value === this.filterSort)?.label || 'Destacados';
    }
    return '';
  }

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
        this.allProperties = list;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading properties within radius:', err);
        this.allProperties = [];
        this.propertiesList = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    let filtered = this.allProperties.filter((prop: any) => {
      if (this.filterTransaction) {
        const propTrans = (prop.transaction || prop.operacion || prop.status || '').toLowerCase();
        if (propTrans !== this.filterTransaction.toLowerCase()) {
          return false;
        }
      }

      if (this.filterType) {
        const propType = (prop.type || prop.tipoVivienda || prop.residence?.type || '').toLowerCase();
        if (propType !== this.filterType.toLowerCase()) {
          return false;
        }
      }

      const price = Number(prop.price) || 0;
      if (this.filterMinPrice !== null && price < this.filterMinPrice) {
        return false;
      }
      if (this.filterMaxPrice !== null && price > this.filterMaxPrice) {
        return false;
      }

      if (this.filterBeds) {
        const beds = Number(prop.residence?.bedrooms || prop.beds || prop.habitaciones) || 0;
        const requiredBeds = Number(this.filterBeds);
        
        if (requiredBeds === 4) {
          if (beds < 4) return false;
        } else {
          if (beds !== requiredBeds) return false;
        }
      }

      if (this.filterBaths) {
        const baths = Number(prop.residence?.bathrooms || prop.baths || prop.banos || prop.residence?.baths) || 0;
        const requiredBaths = Number(this.filterBaths);
        if (requiredBaths === 3) {
          if (baths < 3) return false;
        } else {
          if (baths !== requiredBaths) return false;
        }
      }

      const size = Number(prop.residence?.size || prop.size || prop.superficie || prop.m2) || 0;
      if (this.filterMinSize !== null && size < this.filterMinSize) {
        return false;
      }
      if (this.filterMaxSize !== null && size > this.filterMaxSize) {
        return false;
      }

      const desc = (prop.description || prop.descripcion || '').toLowerCase();

      if (this.filterHasPool) {
        const hasPool = prop.residence?.pool || prop.pool || prop.hasPool || desc.includes('piscina');
        if (!hasPool) return false;
      }

      if (this.filterHasGarden) {
        const hasGarden = prop.residence?.garden || prop.garden || prop.hasGarden || desc.includes('jardín') || desc.includes('jardin');
        if (!hasGarden) return false;
      }

      if (this.filterHasTerrace) {
        const hasTerrace = prop.residence?.terrace || prop.terrace || prop.hasTerrace || desc.includes('terraza');
        if (!hasTerrace) return false;
      }

      if (this.filterHasElevator) {
        const hasElevator = prop.residence?.elevator || prop.elevator || prop.hasElevator || desc.includes('ascensor');
        if (!hasElevator) return false;
      }

      if (this.filterHasAC) {
        const hasAC = prop.residence?.ac || prop.ac || prop.hasAc || desc.includes('aire') || desc.includes('climatizado');
        if (!hasAC) return false;
      }

      return true;
    });

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
    this.filterBaths = '';
    this.filterMinSize = null;
    this.filterMaxSize = null;
    this.filterHasPool = false;
    this.filterHasGarden = false;
    this.filterHasTerrace = false;
    this.filterHasElevator = false;
    this.filterHasAC = false;
    this.applyFilters();
  }

  goToCatalog() {
    this.router.navigate(['/propiedades']);
  }
}
