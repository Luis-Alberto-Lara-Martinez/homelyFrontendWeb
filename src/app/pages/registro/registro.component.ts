import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Users } from '../../services/users/users';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  private readonly googleClientId: string = environment.googleClientId;
  private readonly microsoftClientId: string = environment.microsoftClientId;

  registroForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usersService: Users,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.registroForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.handleRedirectCallback();
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
            this.zone.run(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            });
          })
        )
        .subscribe({
          next: (response) => {
            this.zone.run(() => {
              if (response && response.token) {
                localStorage.setItem('token', response.token);
                // Cargar perfil para actualizar cabecera
                this.usersService.getUserProfile().subscribe();
                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/login']);
              }
            });
          },
          error: (err) => {
            this.zone.run(() => {
              console.error('Error en registro:', err);
              this.errorMessage = err.error?.message || 'Error al registrar el usuario. El correo podría estar ya en uso.';
            });
          }
        });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const state = this.generateRandomString(32);
      const nonce = this.generateRandomString(32);

      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_nonce', nonce);

      const scope = 'openid email profile';
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${this.googleClientId}` +
        `&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname)}` +
        `&response_type=token id_token` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${state}` +
        `&nonce=${nonce}` +
        `&prompt=select_account`;
    } catch (error) {
      console.error('❌ Error en signIn:', error);
      throw error;
    }
  }

  async signInWithMicrosoft(): Promise<void> {
    try {
      const state = this.generateRandomString(32);
      const nonce = this.generateRandomString(32);

      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_nonce', nonce);

      const scope = 'openid profile email';
      window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${this.microsoftClientId}` +
        `&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname)}` +
        `&response_type=token id_token` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${state}` +
        `&nonce=${nonce}` +
        `&response_mode=fragment` +
        `&prompt=select_account`;
    } catch (error) {
      console.error('❌ Error en signIn:', error);
      throw error;
    }
  }

  private handleRedirectCallback(): void {
    const hash = window.location.hash;

    if (hash.includes('id_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');

      if (idToken) {
        this.isLoading = true;
        this.usersService.oauth2Register(idToken)
          .pipe(
            finalize(() => {
              this.zone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
              });
            })
          )
          .subscribe({
            next: (response) => {
              this.zone.run(() => {
                if (response && response.token) {
                  localStorage.setItem('token', response.token);
                  // Cargar perfil para actualizar cabecera
                  this.usersService.getUserProfile().subscribe();
                  window.history.replaceState(null, '', window.location.pathname);
                  this.router.navigate(['/home']);
                } else {
                  this.errorMessage = 'Error al procesar el registro social.';
                }
              });
            },
            error: (err) => {
              this.zone.run(() => {
                console.error('Error en OAuth register:', err);
                if (err.error && typeof err.error === 'object') {
                  this.errorMessage = err.error.message || err.error.error || 'Error en el registro social.';
                } else {
                  this.errorMessage = typeof err.error === 'string' ? err.error : 'Error al conectar con el servidor.';
                }
              });
            }
          });
      }
    }
  }

  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  }
}
