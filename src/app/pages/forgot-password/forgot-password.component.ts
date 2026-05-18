import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResetPassword } from '../../services/reset-password/reset-password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  submitted = false;
  message = '';

  constructor(private fb: FormBuilder, private resetPasswordService: ResetPassword) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      const email = this.forgotForm.value.email;
      this.resetPasswordService.sendResetEmail(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message = response.message;
          this.submitted = true;
          this.forgotForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.message = error.error;
          this.submitted = true;
        }
      });
    }
  }
}
