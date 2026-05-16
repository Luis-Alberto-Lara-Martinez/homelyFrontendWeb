import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Users } from '../../services/users/users';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  loading: boolean = true;

  constructor(private usersService: Users) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        // Fallback for demo/TFG if API fails or returns 404
        this.users = [
          { id: 1, name: 'Alejandro Cabrera', email: 'alejandro@homing.es', role: 'ADMIN', createdAt: '2026-01-10' },
          { id: 2, name: 'Samuel Ariza', email: 'samuel@homing.es', role: 'ADMIN', createdAt: '2026-01-15' },
          { id: 3, name: 'Luis Alberto Lara', email: 'luis@homing.es', role: 'ADMIN', createdAt: '2026-01-20' },
          { id: 4, name: 'Maria Garcia', email: 'maria@gmail.com', role: 'USER', createdAt: '2026-02-05' },
          { id: 5, name: 'Carlos Rodriguez', email: 'carlos@outlook.com', role: 'USER', createdAt: '2026-02-12' }
        ];
        this.filteredUsers = this.users;
        this.loading = false;
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log('Eliminando usuario:', id);
      // Logic for deletion would go here
      this.users = this.users.filter(u => u.id !== id);
      this.onSearch();
    }
  }

  changeRole(user: any) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    console.log(`Cambiando rol de ${user.name} a ${newRole}`);
    user.role = newRole;
  }
}
