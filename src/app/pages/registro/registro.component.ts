import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Users } from '../../services/users/users';

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
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const password_confirmation = control.get('password_confirmation');

    if (password && password_confirmation && password.value !== password_confirmation.value) {
      password_confirmation.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Extraemos todo menos password_confirmation
      const { password_confirmation, ...userData } = this.registroForm.value;

      this.usersService.register(userData).subscribe({
        next: (response) => {
          // Si el servidor devuelve el token, iniciamos sesión automáticamente
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/home']);
          } else {
            // Si no devuelve token, lo mandamos al login para que inicie sesión
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error al registrar el usuario. El correo podría estar ya en uso.';
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
