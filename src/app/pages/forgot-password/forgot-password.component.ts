import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center shadow-xl shadow-brand-blue/20">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>
        <h2 class="text-center text-3xl font-black text-brand-dark tracking-tight">Recuperar contraseña</h2>
        <p class="mt-2 text-center text-sm text-gray-500 max-w">
          Introduce tu email y te enviaremos las instrucciones para restablecer tu cuenta.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Correo Electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input id="email" type="email" formControlName="email"
                  class="block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all placeholder-gray-300"
                  placeholder="ejemplo@correo.com">
              </div>
              <p *ngIf="forgotForm.get('email')?.touched && forgotForm.get('email')?.invalid" class="mt-2 text-xs text-red-500 font-medium">
                Introduce un correo electrónico válido.
              </p>
            </div>

            <button type="submit" [disabled]="forgotForm.invalid || isLoading"
              class="w-full flex justify-center py-4 px-4 rounded-2xl shadow-xl shadow-brand-blue/20 text-sm font-black uppercase tracking-widest text-white bg-brand-blue hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all disabled:opacity-50 disabled:shadow-none active:scale-95">
              {{ isLoading ? 'Enviando...' : 'Enviar instrucciones' }}
            </button>
          </form>

          <!-- Mensaje de éxito -->
          <div *ngIf="submitted" class="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex gap-3">
              <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-green-800">
                ¡Enviado! Revisa tu bandeja de entrada para continuar.
              </p>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center">
            <a routerLink="/login" class="text-sm font-bold text-brand-blue hover:text-brand-dark transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      // Simulamos envío al backend
      setTimeout(() => {
        this.isLoading = false;
        this.submitted = true;
        console.log('Solicitud de recuperación enviada para:', this.forgotForm.value.email);
      }, 1500);
    }
  }
}
