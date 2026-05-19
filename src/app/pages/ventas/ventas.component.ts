import { Component, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Properties } from '../../services/properties/properties';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnDestroy {
  private propertiesService = inject(Properties);
  private router = inject(Router);

  currentStep: number = 1;
  totalSteps: number = 4;

  // Selected Images
  selectedImages: { file: File, previewUrl: string }[] = [];

  // Form Data
  formData = {
    tipoVivienda: 'casa',
    operacion: 'venta',
    titulo: '',
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
    switch (this.currentStep) {
      case 1: return 'Datos básicos del anuncio';
      case 2: return 'Ubicación del inmueble';
      case 3: return 'Características principales';
      case 4: return 'Detalles comerciales del anuncio';
      default: return '';
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.formData.tipoVivienda && !!this.formData.operacion;
      case 2:
        return !!this.formData.latitud && !!this.formData.longitud;
      case 3:
        return !!this.formData.metros && Number(this.formData.metros) > 0;
      case 4:
        return !!this.formData.titulo?.trim() &&
          !!this.formData.descripcion?.trim() &&
          !!this.formData.precio &&
          Number(this.formData.precio) > 0;
      default:
        return true;
    }
  }

  nextStep() {
    if (!this.isStepValid(this.currentStep)) {
      if (this.currentStep === 2) {
        this.locationError = 'Debe buscar y obtener la ubicación exacta del inmueble en el mapa antes de continuar.';
      }
      return;
    }
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

  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  async buscarUbicacion() {
    if (!this.formData.direccion || !this.formData.ciudad) {
      this.locationError = 'Por favor, introduce la dirección y ciudad completas.';
      this.formData.latitud = '';
      this.formData.longitud = '';
      return;
    }

    this.isSearchingLocation = true;
    this.locationError = '';
    this.cdr.detectChanges();

    try {
      let lat = '';
      let lon = '';

      // 1. Intentar geocodificar con la dirección completa tal como se ha introducido
      const query1 = `${this.formData.direccion}, ${this.formData.ciudad}, ${this.formData.codigoPostal || ''}, España`;
      const data1 = await this.queryGeocode(query1);

      if (data1 && data1.length > 0) {
        lat = data1[0].lat;
        lon = data1[0].lon;
      } else {
        // 2. Fallback: Si no encuentra nada, limpiar detalles de piso, puerta, bloque o letras
        // En España es común poner "Calle Mayor 12, 3º B", lo cual rompe a Nominatim.
        const direccionLimpia = this.formData.direccion
          .split(',')[0] // Tomar la primera parte antes de la coma
          .replace(/\s*(?:\d+)?\s*(?:º|ª|piso|puerta|letra|bloque|bloq|esc|escalera|izq|der|duplicado|dup).*$/i, '')
          .trim();

        if (direccionLimpia && direccionLimpia.toLowerCase() !== this.formData.direccion.trim().toLowerCase()) {
          const query2 = `${direccionLimpia}, ${this.formData.ciudad}, España`;
          const data2 = await this.queryGeocode(query2);
          if (data2 && data2.length > 0) {
            lat = data2[0].lat;
            lon = data2[0].lon;
          }
        }
      }

      if (lat && lon) {
        this.formData.latitud = lat;
        this.formData.longitud = lon;
      } else {
        this.locationError = 'No se ha podido encontrar la dirección exacta en el mapa. Revisa el nombre de la calle e inténtalo de nuevo.';
        this.formData.latitud = '';
        this.formData.longitud = '';
      }
    } catch (error: any) {
      console.error(error);
      this.locationError = 'Error de conexión con el servicio de mapas. Comprueba tu conexión a internet o inténtalo más tarde.';
      this.formData.latitud = '';
      this.formData.longitud = '';
    } finally {
      this.isSearchingLocation = false;
      this.cdr.detectChanges();
    }
  }

  private async queryGeocode(query: string): Promise<any[]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // Timeout rápido de 3.5 segundos

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'es' // Forzar idioma español
        }
      });
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (e) {
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get mapUrl(): SafeResourceUrl | string {
    if (this.formData.latitud && this.formData.longitud) {
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(this.formData.longitud) - 0.005},${parseFloat(this.formData.latitud) - 0.005},${parseFloat(this.formData.longitud) + 0.005},${parseFloat(this.formData.latitud) + 0.005}&layer=mapnik&marker=${this.formData.latitud},${this.formData.longitud}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }

  ngOnDestroy() {
    this.selectedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.addFiles(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(files);
    }
  }

  private addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        this.selectedImages.push({ file, previewUrl });
      }
    }
    this.cdr.detectChanges();
  }

  removeImage(index: number) {
    const img = this.selectedImages[index];
    if (img) {
      URL.revokeObjectURL(img.previewUrl);
      this.selectedImages.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  isSubmitting = false;
  submitError = '';

  publicarAnuncio() {
    if (!this.isStepValid(this.currentStep)) return;

    this.isSubmitting = true;
    this.submitError = '';
    this.cdr.detectChanges();

    const addressDto = {
      street: this.formData.direccion,
      number: '',
      floor: '',
      door: '',
      postalCode: this.formData.codigoPostal,
      city: this.formData.ciudad,
      province: this.formData.ciudad,
      country: 'España',
      latitude: parseFloat(this.formData.latitud),
      longitude: parseFloat(this.formData.longitud)
    };

    const residenceDto = (this.formData.tipoVivienda === 'casa' || this.formData.tipoVivienda === 'apartamento') ? {
      bedrooms: this.formData.habitaciones,
      bathrooms: this.formData.banos,
      conservation: 'Bueno',
      orientation: 'Norte'
    } : null;

    const extrasList: any[] = [];
    if (this.formData.tipoVivienda === 'casa' || this.formData.tipoVivienda === 'apartamento') {
      if (this.formData.extrasCasa.garaje) extrasList.push({ id: null, name: 'garaje' });
      if (this.formData.extrasCasa.piscina) extrasList.push({ id: null, name: 'piscina' });
      if (this.formData.extrasCasa.ascensor) extrasList.push({ id: null, name: 'ascensor' });
      if (this.formData.extrasCasa.terraza) extrasList.push({ id: null, name: 'terraza' });
    } else if (this.formData.tipoVivienda === 'garaje') {
      if (this.formData.extrasGaraje.cubierto) extrasList.push({ id: null, name: 'cubierto' });
      if (this.formData.extrasGaraje.seguridad24h) extrasList.push({ id: null, name: 'seguridad24h' });
      if (this.formData.extrasGaraje.puertaAutomatica) extrasList.push({ id: null, name: 'puertaAutomatica' });
    } else if (this.formData.tipoVivienda === 'trastero') {
      if (this.formData.extrasTrastero.acceso24h) extrasList.push({ id: null, name: 'acceso24h' });
      if (this.formData.extrasTrastero.seguridad) extrasList.push({ id: null, name: 'seguridad' });
      if (this.formData.extrasTrastero.estanterias) extrasList.push({ id: null, name: 'estanterias' });
    }

    const payload = {
      type: this.formData.tipoVivienda,
      status: 'Disponible',
      transaction: this.formData.operacion,
      title: this.formData.titulo,
      description: this.formData.descripcion,
      surface: parseInt(this.formData.metros),
      price: parseFloat(this.formData.precio),
      updatedBy: null,
      images: [],
      extras: extrasList,
      address: addressDto,
      residence: residenceDto,
      energyCertificate: {
        hasCertificate: false,
        consumptionScale: 'G',
        consumptionValue: 0,
        emissionsScale: 'G',
        emissionsValue: 0
      }
    };

    this.propertiesService.createProperty(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/properties']);
      },
      error: (err) => {
        console.error('Error al registrar la propiedad:', err);
        this.submitError = 'Hubo un error al registrar la propiedad. Por favor, comprueba que el backend esté levantado y tenga el endpoint configurado.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}

