import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trabaja-con-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './trabaja-con-nosotros.component.html'
})
export class TrabajaConNosotrosComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    position: 'Agente Inmobiliario',
    experience: '',
    portfolio: '',
    message: ''
  };

  submitted = false;

  positions = [
    'Agente Inmobiliario',
    'Asesor Financiero',
    'Marketing & Diseño',
    'Desarrollo de Software',
    'Atención al Cliente',
    'Administración'
  ];

  onSubmit() {
    console.log('Solicitud enviada:', this.formData);
    this.submitted = true;

    // Simulate API call
    setTimeout(() => {
      // In a real app, we would send this to the backend
    }, 1500);
  }
}
