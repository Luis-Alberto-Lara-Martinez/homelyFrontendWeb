import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../../services/users/users';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  private readonly googleClientId: string = environment.googleClientId;
  private readonly microsoftClientId: string = environment.microsoftClientId;

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usersService: Users,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.handleRedirectCallback();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.usersService.login(this.loginForm.value)
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
              console.log('Respuesta del backend:', response);
              if (response && response.token) {
                localStorage.setItem('token', response.token);
                // Cargar perfil para actualizar cabecera
                this.usersService.getUserProfile().subscribe();
                this.router.navigate(['/home']);
              } else {
                this.errorMessage = response?.message || 'El servidor no devolvió un token válido.';
              }
            });
          },
          error: (err) => {
            this.zone.run(() => {
              console.error('Error en el login:', err);
              if (err.error && typeof err.error === 'object') {
                this.errorMessage = err.error.message || err.error.error || 'Credenciales incorrectas.';
              } else if (typeof err.error === 'string') {
                this.errorMessage = err.error;
              } else {
                this.errorMessage = 'Credenciales inválidas o error en el servidor.';
              }
            });
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
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
        this.usersService.oauth2login(idToken)
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
                  this.errorMessage = 'Error al procesar el inicio de sesión social.';
                }
              });
            },
            error: (err) => {
              this.zone.run(() => {
                console.error('Error en OAuth login:', err);
                if (err.error && typeof err.error === 'object') {
                  this.errorMessage = err.error.message || err.error.error || 'Error en el login social.';
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
