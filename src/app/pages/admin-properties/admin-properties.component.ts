import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-brand-dark mb-4">Administrar Propiedades</h1>
        <p class="text-gray-500">Esta sección está en desarrollo.</p>
      </div>
    </div>
  `
})
export class AdminPropertiesComponent {}
