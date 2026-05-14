import { Component, ChangeDetectorRef } from '@angular/core';
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

  constructor(private cdr: ChangeDetectorRef) {}

  openMapModal() {
    this.showMapModal = true;
    setTimeout(() => {
      this.initMap();
      // Refrescar tamaño del mapa después de la animación del modal
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
    this.cdr.detectChanges(); // Forzar actualización de la vista
  }

  initMap() {
    if (this.map) return;

    this.map = L.map('map-container').setView([40.4168, -3.7038], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Icono personalizado para evitar errores 404 de Angular
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.map.on('click', (e: any) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: customIcon }).addTo(this.map);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  async reverseGeocode(lat: number, lon: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
      const data = await response.json();

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const state = data.address.state || data.address.region;

        if (city && state) {
          this.location = `${city}, ${state}`;
        } else if (city) {
          this.location = city;
        } else if (state) {
          this.location = state;
        } else if (data.display_name) {
          this.location = data.display_name.split(',')[0];
        }
      } else {
        this.location = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      this.location = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } finally {
      // Siempre cerrar el modal después de seleccionar una ubicación, con un pequeño retraso
      setTimeout(() => {
        this.closeMapModal();
      }, 500); 
    }
  }
}
