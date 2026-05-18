import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResetPassword } from '../../services/reset-password/reset-password';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string = '';
  tokenStatus: 'checking' | 'valid' | 'invalid' = 'checking';
  isLoading = false;
  submitted = false;
  message = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private resetPasswordService: ResetPassword,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.verifyToken();
      } else {
        this.tokenStatus = 'invalid';
        this.message = 'No se ha proporcionado ningún token de recuperación.';
      }
    });
  }

  private initForm(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmedPassword = g.get('confirmedPassword')?.value;
    return password === confirmedPassword ? null : { mismatch: true };
  }

  verifyToken(): void {
    this.tokenStatus = 'checking';
    this.cdr.detectChanges();
    this.resetPasswordService.checkResetToken(this.token).subscribe({
      next: (response) => {
        this.zone.run(() => {
          this.tokenStatus = 'valid';
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.zone.run(() => {
          this.tokenStatus = 'invalid';
          if (error.error && typeof error.error === 'object' && error.error.error) {
            this.message = error.error.error;
          } else if (error.error && typeof error.error === 'string') {
            this.message = error.error;
          } else {
            this.message = 'El token no es válido o ha expirado.';
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.token) {
      this.isLoading = true;
      this.cdr.detectChanges();
      const { password, confirmedPassword } = this.resetForm.value;

      this.resetPasswordService.resetPassword(this.token, password, confirmedPassword).subscribe({
        next: (response) => {
          this.zone.run(() => {
            this.isLoading = false;
            this.isSuccess = true;
            this.message = response.message || 'Contraseña restablecida con éxito.';
            this.submitted = true;
            this.resetForm.reset();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          this.zone.run(() => {
            this.isLoading = false;
            this.isSuccess = false;
            if (error.error && typeof error.error === 'object' && error.error.error) {
              this.message = error.error.error;
            } else if (error.error && typeof error.error === 'string') {
              this.message = error.error;
            } else {
              this.message = 'Ocurrió un error al intentar restablecer la contraseña.';
            }
            this.submitted = true;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }
}
