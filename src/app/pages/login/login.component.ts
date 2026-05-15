import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Users} from '../../services/users/users';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  private readonly googleClientId: string = environment.googleClientId;

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usersService: Users,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.handleRedirectCallback();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.usersService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/home']);
          } else {
            this.isLoading = false;
            this.errorMessage = 'El servidor no devolvió un token válido. Contacte con soporte.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Credenciales inválidas o error en el servidor.';
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

  private handleRedirectCallback(): void {
    const hash = window.location.hash;

    if (hash.includes('id_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');

      if (idToken) {
        this.usersService.oauth2login(idToken).subscribe({
          next: (response) => {
            if (response && response.token) {
              localStorage.setItem('token', response.token);
              window.history.replaceState(null, '', window.location.pathname);
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            this.errorMessage = err.error;
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
