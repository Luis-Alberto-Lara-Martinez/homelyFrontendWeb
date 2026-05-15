import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Users } from '../../services/users/users';


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

  constructor(private usersService: Users) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.usersService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMessage = 'No se pudo cargar la información del perfil.';
        this.isLoading = false;
      }
    });
  }
}
