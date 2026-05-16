import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  // Modal de Eliminación
  showDeleteModal: boolean = false;
  userToDelete: any = null;
  isDeleting: boolean = false;

  // Paginación
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 3;

  constructor(
    private usersService: Users,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1) {
    this.loading = true;
    this.usersService.getAllUsers(page, this.pageSize).subscribe({
      next: (data: any) => {
        this.users = data.content;
        this.filteredUsers = data.content;

        // Actualizamos estado de paginación
        this.currentPage = page;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;

        this.loading = false;
        console.log('Usuarios cargados:', this.users);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  openDeleteModal(user: any) {
    this.userToDelete = user;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (!this.userToDelete) return;
    
    this.isDeleting = true;
    this.usersService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadUsers(this.currentPage);
        this.closeDeleteModal();
      },
      error: (err) => {
        this.isDeleting = false;
        console.error('Error deleting user:', err);
        this.closeDeleteModal();
      }
    });
  }

  changeRole(user: any) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    console.log(`Cambiando rol de ${user.name} a ${newRole}`);
    user.role = newRole;
  }
}
