import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Users } from '../../services/users/users';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  registroForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usersService: Users,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmedPassword = control.get('confirmedPassword');

    if (password && confirmedPassword && password.value !== confirmedPassword.value) {
      confirmedPassword.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { name, email, password, confirmedPassword } = this.registroForm.value;
      
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        confirmedPassword: confirmedPassword
      };

      this.usersService.register(userData)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response && response.token) {
              localStorage.setItem('token', response.token);
              // Cargar perfil para actualizar cabecera
              this.usersService.getUserProfile().subscribe();
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('Error en registro:', err);
            this.errorMessage = err.error?.message || 'Error al registrar el usuario. El correo podría estar ya en uso.';
          }
        });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
