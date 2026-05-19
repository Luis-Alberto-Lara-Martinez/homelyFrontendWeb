import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Properties } from '../../services/properties/properties';

import { RouterModule } from '@angular/router';

// Triggering build
@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-properties.component.html'
})
export class AdminPropertiesComponent implements OnInit {
  properties: any[] = [];
  filteredProperties: any[] = [];
  searchQuery: string = '';
  loading: boolean = true;

  // Modals
  showDeleteModal: boolean = false;
  propertyToDelete: any = null;
  isDeleting: boolean = false;

  // Pagination (Frontend)
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;

  // Toast
  toast: { show: boolean, message: string, type: 'success' | 'error' } = { show: false, message: '', type: 'success' };
  toastTimeout: any;

  constructor(
    private propertiesService: Properties,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.propertiesService.getAllProperties().subscribe({
      next: (data: any) => {
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray(data.content)) {
          items = data.content;
        } else if (data && Array.isArray(data.data)) {
          items = data.data;
        }

        this.properties = items;
        this.totalElements = items.length;
        this.updatePagination();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        this.loading = false;
        this.showToast('Error al cargar propiedades.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  updatePagination() {
    let filtered = this.properties;

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = this.properties.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.address && typeof p.address === 'string' && p.address.toLowerCase().includes(q))
      );
    }

    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProperties = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onSearch() {
    this.currentPage = 1;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  openDeleteModal(property: any) {
    this.propertyToDelete = property;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.propertyToDelete = null;
  }

  confirmDelete() {
    if (!this.propertyToDelete) return;

    this.isDeleting = true;
    this.propertiesService.deleteProperty(this.propertyToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showToast('Propiedad eliminada correctamente.', 'success');
        this.closeDeleteModal();
        this.loadProperties();
      },
      error: (err) => {
        console.error('Error deleting property', err);
        this.isDeleting = false;
        this.showToast('Error al eliminar la propiedad.', 'error');
        this.closeDeleteModal();
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast = { show: true, message, type };
    this.cdr.detectChanges();
    this.toastTimeout = setTimeout(() => {
      this.toast.show = false;
      this.cdr.detectChanges();
    }, 4000);
  }

  formatImageUrl(url: string): string {
    if (!url) return url;
    const targetBase = 'https://res.cloudinary.com/homely-cloudinary/image/upload/';
    if (url.startsWith(targetBase) && !url.includes('homely/properties/')) {
      const pathPart = url.substring(targetBase.length);
      const match = pathPart.match(/^(v\d+\/)?(.+)$/);
      if (match) {
        const version = match[1] || '';
        const filename = match[2];
        return `${targetBase}${version}homely/properties/${filename}`;
      }
    }
    return url;
  }

  getFirstImage(property: any): string {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      let img = property.images[0];
      if (typeof img === 'object' && img.imageUrl) {
        return this.formatImageUrl(img.imageUrl);
      }
      return this.formatImageUrl(img);
    }
    if (property.imageUrl) return this.formatImageUrl(property.imageUrl);
    return '/assets/img/house-placeholder.jpg';
  }

  getLocation(property: any): string {
    if (property.address) {
      if (typeof property.address === 'object') {
        const parts = [];
        if (property.address.street) parts.push(property.address.street);
        if (property.address.city) parts.push(property.address.city);
        return parts.join(', ') || 'Ubicación no especificada';
      }
      return property.address;
    }
    return property.location || 'Ubicación no especificada';
  }

  getType(property: any): string {
    return property.type || property.residence?.type || 'Vivienda';
  }

  getStatus(property: any): string {
    return property.transaction || property.status || 'En Venta';
  }
}
