import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Users } from '../../services/users/users';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private usersService: Users,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

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
}
