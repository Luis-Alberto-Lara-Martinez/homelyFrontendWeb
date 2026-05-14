import { Component } from '@angular/core';
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
    habitaciones: 1,
    banos: 1,
    metros: '',
    extras: {
      garaje: false,
      piscina: false,
      ascensor: false,
      terraza: false
    },
    precio: '',
    descripcion: '',
    telefono: ''
  };

  tiposVivienda = [
    { id: 'casa', nombre: 'Casa o Chalet', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'apartamento', nombre: 'Apartamento', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'villa', nombre: 'Villa de Lujo', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { id: 'estudio', nombre: 'Estudio', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' }
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
}
