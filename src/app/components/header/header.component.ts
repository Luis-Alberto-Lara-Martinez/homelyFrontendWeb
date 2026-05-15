import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Users } from '../../services/users/users';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  menuOpen = false;
  dropdownOpen = false;

  constructor(public usersService: Users, private router: Router) { }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
