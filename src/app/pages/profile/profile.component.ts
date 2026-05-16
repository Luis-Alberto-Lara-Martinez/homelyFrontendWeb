import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Users } from '../../services/users/users';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Cambio de contraseña
  passwordForm: FormGroup;
  showPasswordForm: boolean = false;
  isUpdatingPassword: boolean = false;
  passwordSuccessMessage: string = '';
  passwordErrorMessage: string = '';

  // Visibilidad de contraseñas
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Edición de Perfil
  isEditingProfile: boolean = false;
  editName: string = '';
  selectedFile: File | null = null;
  avatarPreview: string | null = null;
  isSavingProfile: boolean = false;
  profileSuccessMessage: string = '';
  profileErrorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: Users,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.usersService.getUserProfile()
      .pipe(
        finalize(() => {
          this.zone.run(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        })
      )
      .subscribe({
        next: (data) => {
          this.zone.run(() => {
            console.log('Perfil cargado:', data);
            this.user = data;
          });
        },
        error: (err) => {
          this.zone.run(() => {
            console.error('Error al cargar perfil:', err);
            this.errorMessage = 'No se pudo cargar la información del perfil.';
          });
        }
      });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'old') this.showOldPassword = !this.showOldPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
      this.passwordSuccessMessage = '';
      this.passwordErrorMessage = '';
    }
  }

  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      this.isUpdatingPassword = true;
      this.passwordSuccessMessage = '';
      this.passwordErrorMessage = '';

      const { newPassword, confirmPassword } = this.passwordForm.value;

      this.usersService.updateUserPassword({
        password: newPassword.trim(),
        confirmedPassword: confirmPassword.trim()
      })
        .pipe(
          finalize(() => {
            this.zone.run(() => {
              this.isUpdatingPassword = false;
              this.cdr.detectChanges();
            });
          })
        )
        .subscribe({
          next: () => {
            this.zone.run(() => {
              this.passwordSuccessMessage = 'Contraseña actualizada correctamente.';
              this.passwordForm.reset();
              setTimeout(() => {
                this.showPasswordForm = false;
                this.passwordSuccessMessage = '';
                this.cdr.detectChanges();
              }, 3000);
            });
          },
          error: (err) => {
            this.zone.run(() => {
              console.error('Error al actualizar contraseña:', err);
              if (err.error && typeof err.error === 'object') {
                this.passwordErrorMessage = err.error.message || err.error.error || 'No se pudo actualizar la contraseña. Verifique su contraseña actual.';
              } else if (typeof err.error === 'string') {
                this.passwordErrorMessage = err.error;
              } else {
                this.passwordErrorMessage = 'Error al conectar con el servidor o contraseña actual incorrecta.';
              }
            });
          }
        });
    }
  }

  // Notificaciones (Pop-up)
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'loading' = 'success';

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    if (this.isEditingProfile) {
      this.editName = this.user?.name || '';
    } else {
      this.selectedFile = null;
      this.avatarPreview = null;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.cdr.detectChanges();
        // Subida automática al seleccionar imagen
        this.onUpdateProfile(true);
      };
      reader.readAsDataURL(file);
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'loading' = 'success'): void {
    this.zone.run(() => {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      this.cdr.detectChanges();
      
      // Si es carga, no lo cerramos automáticamente (esperamos al resultado)
      if (type !== 'loading') {
        setTimeout(() => {
          this.showToast = false;
          this.cdr.detectChanges();
        }, 4000);
      }
    });
  }

  onUpdateProfile(isAvatarOnly: boolean = false): void {
    const nameToSave = isAvatarOnly ? undefined : this.editName;
    const fileToSave = this.selectedFile || undefined;

    if (!nameToSave && !fileToSave) return;

    this.isSavingProfile = true;
    this.showNotification('Actualizando perfil, espera un momento...', 'loading');
    
    this.usersService.updateUserProfile(nameToSave, fileToSave)
      .pipe(
        finalize(() => {
          this.zone.run(() => {
            this.isSavingProfile = false;
            this.selectedFile = null;
            this.cdr.detectChanges();
          });
        })
      )
      .subscribe({
        next: (updatedUser) => {
          this.zone.run(() => {
            this.user = updatedUser;
            this.isEditingProfile = false;
            this.avatarPreview = null;
            this.showNotification('¡Perfil actualizado con éxito!', 'success');
          });
        },
        error: (err) => {
          this.zone.run(() => {
            console.error('Error al actualizar perfil:', err);
            const errorMsg = err.error?.message || 'No se pudo actualizar el perfil.';
            this.showNotification(errorMsg, 'error');
            this.avatarPreview = null;
          });
        }
      });
  }
}
