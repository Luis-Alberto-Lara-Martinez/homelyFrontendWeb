import { Component, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare let L: any;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  maxPrice: number = 500000;
  location: string = '';
  showMapModal: boolean = false;
  private map: any;
  private marker: any;

  distance: number = 2;
  searchQuery: string = '';
  tempLocationData: any = null;
  private circle: any;

  get formattedMaxPrice(): string {
    if (!this.maxPrice && this.maxPrice !== 0) return '';
    return new Intl.NumberFormat('en-US').format(this.maxPrice);
  }

  set formattedMaxPrice(value: string) {
    const cleanValue = value.replace(/\D/g, '');
    this.maxPrice = cleanValue ? parseInt(cleanValue, 10) : 0;
  }

  // Custom Dropdowns
  propertyTypeOpen = false;
  operationOpen = false;
  
  propertyTypes = ['Cualquier tipo', 'Casa o Chalet', 'Apartamento', 'Villa de Lujo', 'Estudio'];
  selectedPropertyType = 'Cualquier tipo';

  operations = ['Comprar', 'Alquilar'];
  selectedOperation = 'Comprar';

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.propertyTypeOpen = false;
      this.operationOpen = false;
    }
  }

  togglePropertyType() {
    this.propertyTypeOpen = !this.propertyTypeOpen;
    this.operationOpen = false;
  }

  toggleOperation() {
    this.operationOpen = !this.operationOpen;
    this.propertyTypeOpen = false;
  }

  selectPropertyType(type: string) {
    this.selectedPropertyType = type;
    this.propertyTypeOpen = false;
  }

  selectOperation(op: string) {
    this.selectedOperation = op;
    this.operationOpen = false;
  }

  openMapModal() {
    this.showMapModal = true;
    setTimeout(() => {
      this.initMap();
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 300);
    }, 100);
  }

  closeMapModal() {
    this.showMapModal = false;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
    this.circle = null;
    this.cdr.detectChanges();
  }

  initMap() {
    if (this.map) return;

    // Madrid center as default location
    this.map = L.map('map-container').setView([40.4168, -3.7038], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setMarkerAndCircle(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  setMarkerAndCircle(lat: number, lng: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    
    // Draw circle with brand colors
    this.circle = L.circle([lat, lng], {
      color: '#2563EB', // blue-600
      fillColor: '#3B82F6', // blue-500
      fillOpacity: 0.15,
      weight: 2,
      radius: this.distance * 1000
    }).addTo(this.map);

    this.map.setView([lat, lng], 13);
  }

  updateCircle() {
    if (this.circle && this.marker) {
      this.circle.setRadius(this.distance * 1000);
    }
  }

  async reverseGeocode(lat: number, lon: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
      const data = await response.json();

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const state = data.address.state || data.address.region;

        if (city && state) {
          this.tempLocationData = `${city}, ${state}`;
        } else if (city) {
          this.tempLocationData = city;
        } else if (state) {
          this.tempLocationData = state;
        } else if (data.display_name) {
          this.tempLocationData = data.display_name.split(',')[0];
        }
      } else {
        this.tempLocationData = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      this.tempLocationData = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
    this.cdr.detectChanges();
  }

  async searchCity() {
    if (!this.searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        this.setMarkerAndCircle(lat, lon);
        this.reverseGeocode(lat, lon);
      }
    } catch (err) {
      console.error('Error searching city:', err);
    }
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.setMarkerAndCircle(lat, lon);
          this.reverseGeocode(lat, lon);
        },
        (error) => {
          console.error('Error obtaining location', error);
          alert('No se ha podido acceder a la ubicación. Revisa los permisos del navegador.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  }

  applyLocation() {
    if (this.tempLocationData) {
      this.location = this.tempLocationData;
    }
    this.closeMapModal();
  }
}
