import { Component, AfterViewInit } from '@angular/core';
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

  openMapModal() {
    this.showMapModal = true;
    setTimeout(() => {
      this.initMap();
    }, 100); // Give time for the modal to render
  }

  closeMapModal() {
    this.showMapModal = false;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  initMap() {
    if (this.map) return;
    
    // Coordinates for Madrid, Spain as default
    this.map = L.map('map-container').setView([40.4168, -3.7038], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  async reverseGeocode(lat: number, lon: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
      const data = await response.json();
      
      if (data && data.address) {
        // Build a readable location string
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const state = data.address.state || data.address.region;
        
        if (city && state) {
          this.location = `${city}, ${state}`;
        } else if (city) {
          this.location = city;
        } else if (state) {
          this.location = state;
        } else {
          this.location = data.display_name.split(',')[0];
        }
        
        setTimeout(() => {
          this.closeMapModal();
        }, 800); // Short delay to see the marker before closing
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  }
}
