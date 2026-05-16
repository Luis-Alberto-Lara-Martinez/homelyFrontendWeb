import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Users } from '../../services/users/users';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  dropdownOpen = false;
  user: any = null;

  constructor(
    public usersService: Users, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Suscribirse al estado global del usuario
    this.usersService.user$.subscribe(userData => {
      this.user = userData;
      this.cdr.detectChanges(); // Forzar actualización de la vista
    });

    // Si está autenticado pero no tenemos los datos, los cargamos
    if (this.usersService.isAuthenticated()) {
      this.loadProfile();
    }
  }

  loadProfile() {
    this.usersService.getUserProfile().subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile in header:', err);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.usersService.clearCurrentUser();
    this.router.navigate(['/login']);
    this.dropdownOpen = false;
    this.closeMenu();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
