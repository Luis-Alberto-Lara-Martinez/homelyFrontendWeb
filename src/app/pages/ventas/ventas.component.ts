import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent {
  currentStep: number = 1;
  totalSteps: number = 5;

  // Form Data
  formData = {
    tipoVivienda: 'casa',
    operacion: 'venta',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    latitud: '',
    longitud: '',
    habitaciones: 1,
    banos: 1,
    metros: '',
    extrasCasa: {
      garaje: false,
      piscina: false,
      ascensor: false,
      terraza: false
    },
    extrasGaraje: {
      cubierto: false,
      seguridad24h: false,
      puertaAutomatica: false
    },
    extrasTrastero: {
      acceso24h: false,
      seguridad: false,
      estanterias: false
    },
    precio: '',
    descripcion: '',
    telefono: ''
  };

  isSearchingLocation = false;
  locationError = '';

  tiposVivienda = [
    { id: 'casa', nombre: 'Casa o Chalet', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'apartamento', nombre: 'Apartamento', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'garaje', nombre: 'Garaje', icon: 'M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6M8 14h8m-4-4v8' },
    { id: 'trastero', nombre: 'Trastero', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' }
  ];

  getStepTitle(): string {
    switch(this.currentStep) {
      case 1: return 'Datos básicos del anuncio';
      case 2: return 'Ubicación del inmueble';
      case 3: return 'Características principales';
      case 4: return 'Multimedia y fotografías';
      case 5: return 'Precio y contacto';
      default: return '';
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  selectTipoVivienda(tipo: string) {
    this.formData.tipoVivienda = tipo;
  }

  async buscarUbicacion() {
    if (!this.formData.direccion || !this.formData.ciudad) {
      this.locationError = 'Por favor, introduce la dirección y ciudad completas.';
      return;
    }

    this.isSearchingLocation = true;
    this.locationError = '';

    const query = `${this.formData.direccion}, ${this.formData.ciudad}, ${this.formData.codigoPostal || ''}, España`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        this.formData.latitud = data[0].lat;
        this.formData.longitud = data[0].lon;
      } else {
        this.locationError = 'No se pudo encontrar la ubicación exacta.';
        this.formData.latitud = '';
        this.formData.longitud = '';
      }
    } catch (error) {
      this.locationError = 'Error al buscar la ubicación.';
      this.formData.latitud = '';
      this.formData.longitud = '';
    } finally {
      this.isSearchingLocation = false;
    }
  }

  private sanitizer = inject(DomSanitizer);

  get mapUrl(): SafeResourceUrl | string {
    if (this.formData.latitud && this.formData.longitud) {
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(this.formData.longitud)-0.005},${parseFloat(this.formData.latitud)-0.005},${parseFloat(this.formData.longitud)+0.005},${parseFloat(this.formData.latitud)+0.005}&layer=mapnik&marker=${this.formData.latitud},${this.formData.longitud}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
}
