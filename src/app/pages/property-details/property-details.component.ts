import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Properties } from '../../services/properties/properties';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  description: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  features: string[];
  type: string;
  status: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 pt-24 pb-12">
      <!-- Breadcrumbs -->
      <div class="max-w-7xl mx-auto px-4 mb-6">
        <nav class="flex text-sm font-medium text-gray-500">
          <a routerLink="/" class="hover:text-brand-blue transition-colors">Inicio</a>
          <span class="mx-2">/</span>
          <a [routerLink]="propertiesLink" queryParamsHandling="preserve" class="hover:text-brand-blue transition-colors">Propiedades</a>
          <span class="mx-2">/</span>
          <span class="text-brand-dark">{{ property?.title }}</span>
        </nav>
      </div>

      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Lado Izquierdo: Galería e Información -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Galería de Imágenes Principal -->
            <div class="relative rounded-3xl overflow-hidden shadow-2xl group select-none">
              <!-- Main Image -->
              <img [src]="property?.images?.[activeImageIndex]" (click)="openLightbox()" class="w-full h-[500px] object-cover transition-all duration-300 ease-in-out transform group-hover:scale-102 cursor-zoom-in" [class.opacity-40]="isAnimating" [class.scale-98]="isAnimating" title="Ver imagen completa">
              
              <!-- Badges -->
              <div class="absolute top-6 left-6 flex gap-2 z-10">
                <span class="bg-brand-blue text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">
                  {{ property?.status }}
                </span>
                <span class="bg-white/90 backdrop-blur-md text-brand-dark text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">
                  {{ property?.type }}
                </span>
              </div>

              <!-- Image Counter badge -->
              <div *ngIf="(property?.images?.length || 0) > 1" class="absolute top-6 right-6 bg-brand-dark/75 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg z-10">
                {{ activeImageIndex + 1 }} / {{ property?.images?.length }}
              </div>

              <!-- Navigation Arrows -->
              <ng-container *ngIf="(property?.images?.length || 0) > 1">
                <!-- Left Arrow -->
                <button (click)="prevImage($event)" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 duration-200 z-10 focus:outline-none cursor-pointer">
                  <svg class="w-6 h-6 text-brand-dark animate-in fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                <!-- Right Arrow -->
                <button (click)="nextImage($event)" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 duration-200 z-10 focus:outline-none cursor-pointer">
                  <svg class="w-6 h-6 text-brand-dark animate-in fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
                </button>
              </ng-container>

              <!-- Progress Dots overlay at the bottom -->
              <div *ngIf="(property?.images?.length || 0) > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-brand-dark/30 px-4 py-2.5 rounded-full backdrop-blur-sm">
                <button *ngFor="let img of property?.images; let idx = index" (click)="selectImage(idx, $event)" class="w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer" [class.bg-white]="activeImageIndex === idx" [class.scale-125]="activeImageIndex === idx" [class.bg-white/40]="activeImageIndex !== idx"></button>
              </div>
            </div>

            <!-- Thumbnail list beneath the main image -->
            <div *ngIf="(property?.images?.length || 0) > 1" class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin select-none">
              <button *ngFor="let img of property?.images; let idx = index" (click)="selectImage(idx, $event)" class="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 focus:outline-none border-2 shadow-sm hover:scale-105 active:scale-95 cursor-pointer" [class.border-brand-blue]="activeImageIndex === idx" [class.border-transparent]="activeImageIndex !== idx" [class.shadow-md]="activeImageIndex === idx">
                <img [src]="img" class="w-full h-full object-cover">
                <!-- Overlay to dim inactive thumbnails -->
                <div *ngIf="activeImageIndex !== idx" class="absolute inset-0 bg-brand-dark/15 hover:bg-transparent transition-colors"></div>
              </button>
            </div>

            <!-- Información General -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 class="text-4xl font-black text-brand-dark leading-tight">{{ property?.title }}</h1>
                  <p class="text-gray-500 flex items-center gap-2 mt-2">
                    <svg class="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {{ property?.location }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-4xl font-black text-brand-blue">{{ property?.price | currency:'EUR':'symbol':'1.0-0' }}</div>
                  <p class="text-gray-400 text-sm font-medium mt-1">Impuestos no incluidos</p>
                </div>
              </div>

              <!-- Características Rápidas -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-50 my-8">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-brand-dark">{{ property?.beds }}</div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Dormitorios</div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-brand-dark">{{ property?.baths }}</div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Baños</div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-brand-dark">{{ property?.sqft }}</div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Metros²</div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-brand-dark">A+</div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Energía</div>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <h3 class="text-xl font-bold text-brand-dark mb-4">Sobre esta propiedad</h3>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line mb-8">
                {{ property?.description }}
              </p>

              <!-- Extras/Amenities -->
              <h3 class="text-xl font-bold text-brand-dark mb-6">Equipamiento y Extras</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4">
                <div *ngFor="let feat of property?.features" class="flex items-center gap-3 text-gray-600">
                  <div class="w-2 h-2 bg-brand-blue rounded-full"></div>
                  <span class="font-medium">{{ feat }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Lado Derecho: Contacto y Agente -->
          <div class="space-y-8">
            <!-- Card de Agente -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-28">
              <div class="flex items-center gap-4 mb-6">
                <img [src]="property?.agent?.image" class="w-16 h-16 rounded-2xl object-cover shadow-md">
                <div>
                  <h4 class="font-bold text-brand-dark text-lg">{{ property?.agent?.name }}</h4>
                  <p class="text-brand-blue text-sm font-bold">Agente Senior</p>
                </div>
              </div>

              <!-- Formulario de Contacto -->
              <form class="space-y-4">
                <div>
                  <label class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Tu Nombre</label>
                  <input type="text" placeholder="Ej: Nombre Ejemplo" class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all">
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Tu Email</label>
                  <input type="email" placeholder="ejemplo@correo.com" class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all">
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Mensaje</label>
                  <textarea rows="4" placeholder="Estoy interesado en esta propiedad..." class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all resize-none"></textarea>
                </div>
                <button type="submit" class="w-full bg-brand-blue text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-brand-blue/30 hover:bg-brand-dark active:scale-95 transition-all">
                  Contactar ahora
                </button>
              </form>

              <!-- Botones de Acción Rápida -->
              <div class="grid grid-cols-2 gap-4 mt-6">
                <a [href]="'tel:' + property?.agent?.phone" class="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-bold text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Llamar
                </a>
                <button class="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-bold text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Guardar
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Lightbox Modal Fullscreen -->
      <div *ngIf="isLightboxOpen" (click)="closeLightbox()" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center select-none cursor-zoom-out animate-in fade-in duration-300">
        <!-- Close Button (Glassmorphic capsule) -->
        <button (click)="closeLightbox()" class="absolute top-6 right-6 px-5 py-2.5 bg-black/40 hover:bg-black/60 text-white/95 rounded-full flex items-center gap-2 border border-white/10 transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer focus:outline-none backdrop-blur-md text-sm font-bold shadow-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          Cerrar
        </button>

        <!-- Main Image Container -->
        <div class="relative max-w-5xl max-h-[80vh] w-full px-4 flex items-center justify-center overflow-hidden" (click)="$event.stopPropagation()">
          
          <!-- Large Image inside Modal -->
          <img [src]="property?.images?.[activeImageIndex]" 
               (click)="toggleZoom($event)"
               (mousedown)="startDrag($event)"
               (mousemove)="onDrag($event)"
               (mouseup)="endDrag()"
               (mouseleave)="endDrag()"
               class="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border border-white/10 object-contain transform select-none" 
               [class.transition-transform]="!isDragging"
               [class.duration-300]="!isDragging"
               [class.ease-out]="!isDragging"
               [class.cursor-zoom-in]="zoomLevel === 1"
               [class.cursor-grab]="zoomLevel > 1 && !isDragging"
               [class.cursor-grabbing]="zoomLevel > 1 && isDragging"
               [class.opacity-40]="isAnimating" 
               [style.transform]="'translate3d(' + translateX + 'px, ' + translateY + 'px, 0px) scale(' + zoomLevel + ')'"
               [class.scale-95]="isAnimating && zoomLevel === 1">

          <!-- Navigation inside Lightbox -->
          <ng-container *ngIf="(property?.images?.length || 0) > 1 && zoomLevel === 1">
            <!-- Left Arrow inside Lightbox -->
            <button (click)="prevImage($event)" class="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 duration-200 cursor-pointer focus:outline-none backdrop-blur-md border border-white/10">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <!-- Right Arrow inside Lightbox -->
            <button (click)="nextImage($event)" class="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 duration-200 cursor-pointer focus:outline-none backdrop-blur-md border border-white/10">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </ng-container>
        </div>

        <!-- Zoom Pill Controllers -->
        <div class="mt-4 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-4 text-white z-10 shadow-lg" (click)="$event.stopPropagation()">
          <button (click)="zoomOut($event)" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer focus:outline-none disabled:opacity-40" [disabled]="zoomLevel <= 1" title="Disminuir zoom">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>
          </button>
          <span class="text-sm font-bold w-12 text-center">{{ (zoomLevel * 100).toFixed(0) }}%</span>
          <button (click)="zoomIn($event)" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer focus:outline-none disabled:opacity-40" [disabled]="zoomLevel >= 3" title="Aumentar zoom">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
          </button>
          <button (click)="resetZoom($event)" class="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer focus:outline-none" *ngIf="zoomLevel !== 1">
            Restablecer
          </button>
        </div>

        <!-- Lightbox Counter / Details -->
        <div class="mt-4 text-center bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 text-white/95 shadow-xl" (click)="$event.stopPropagation()">
          <h4 class="font-bold text-lg tracking-tight">{{ property?.title }}</h4>
          <p class="text-white/60 text-xs font-semibold mt-1 uppercase tracking-widest">Imagen {{ activeImageIndex + 1 }} de {{ property?.images?.length }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient-brand {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }
    @keyframes modalFadeIn {
      from { opacity: 0; backdrop-filter: blur(0px); }
      to { opacity: 1; backdrop-filter: blur(24px); }
    }
    @keyframes imageZoomIn {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-modal-fade {
      animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-img-zoom {
      animation: imageZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `]
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  propertiesLink: string = '/propiedades';
  activeImageIndex: number = 0;
  isLightboxOpen: boolean = false;
  isAnimating: boolean = false;

  // Estados de Zoom y Arrastre (Panning)
  zoomLevel: number = 1;
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  translateX: number = 0;
  translateY: number = 0;

  constructor(
    private route: ActivatedRoute,
    private propertiesService: Properties
  ) { }

  openLightbox() {
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
    this.resetZoom();
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    document.body.style.overflow = '';
    this.resetZoom();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isLightboxOpen) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage(event);
      } else if (event.key === 'ArrowRight') {
        this.nextImage(event);
      }
    }
  }

  animateImageChange() {
    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 150);
  }

  // Métodos de control del Zoom
  zoomIn(event: Event) {
    event.stopPropagation();
    this.zoomLevel = Math.min(3, this.zoomLevel + 0.25);
  }

  zoomOut(event: Event) {
    event.stopPropagation();
    this.zoomLevel = Math.max(1, this.zoomLevel - 0.25);
    if (this.zoomLevel === 1) {
      this.translateX = 0;
      this.translateY = 0;
    }
  }

  resetZoom(event?: Event) {
    if (event) event.stopPropagation();
    this.zoomLevel = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
  }

  toggleZoom(event: Event) {
    event.stopPropagation();
    if (this.zoomLevel === 1) {
      this.zoomLevel = 2;
    } else {
      this.resetZoom();
    }
  }

  // Métodos de control del arrastre (Panning)
  startDrag(event: MouseEvent) {
    if (this.zoomLevel > 1) {
      event.preventDefault();
      this.isDragging = true;
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
    }
  }

  onDrag(event: MouseEvent) {
    if (this.isDragging && this.zoomLevel > 1) {
      event.preventDefault();
      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;
    }
  }

  endDrag() {
    this.isDragging = false;
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.property && this.property.images) {
      const len = this.property.images.length;
      this.activeImageIndex = (this.activeImageIndex - 1 + len) % len;
      this.resetZoom();
      this.animateImageChange();
    }
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.property && this.property.images) {
      const len = this.property.images.length;
      this.activeImageIndex = (this.activeImageIndex + 1) % len;
      this.resetZoom();
      this.animateImageChange();
    }
  }

  selectImage(index: number, event: Event) {
    event.stopPropagation();
    if (this.activeImageIndex !== index) {
      this.activeImageIndex = index;
      this.resetZoom();
      this.animateImageChange();
    }
  }

  ngOnInit(): void {
    // Escuchar parámetros de búsqueda para actualizar dinámicamente el enlace del Breadcrumb
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lng = params['lng'];
      if (lat && lng) {
        this.propertiesLink = '/resultados-busqueda';
      } else {
        this.propertiesLink = '/propiedades';
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Opción 1: Obtener directamente del estado de navegación del router (history.state)
        // Este estado contiene el objeto JSON completo de la búsqueda y evita hacer llamadas extra
        const stateData = window.history.state?.property;
        console.log('Homely Detail Page - Received ID:', id, 'State Data:', stateData);
        
        if (stateData && Number(stateData.id) === Number(id)) {
          console.log('Homely Detail Page - Usando datos del estado de navegación (búsqueda anterior)!');
          this.mapPropertyData(stateData);
          return;
        }

        // Opción 2: Buscar en la caché de los últimos resultados de búsqueda del servicio Properties
        const cachedProperty = this.propertiesService.latestResults?.find((p: any) => p && Number(p.id) === Number(id));
        if (cachedProperty) {
          console.log('Homely Detail Page - Encontrado en caché de resultados de búsqueda del servicio!');
          this.mapPropertyData(cachedProperty);
          return;
        }

        // Opción 3: Llamar de respaldo a getAllProperties() para recargas directas o URLs compartidas
        console.log('Homely Detail Page - Buscando en la lista completa del backend de respaldo...');
        this.propertiesService.getAllProperties().subscribe({
          next: (properties: any) => {
            try {
              let list: any[] = [];
              if (Array.isArray(properties)) {
                list = properties;
              } else if (properties && Array.isArray(properties.data)) {
                list = properties.data;
              } else if (properties && Array.isArray(properties.properties)) {
                list = properties.properties;
              } else if (properties && Array.isArray(properties.content)) {
                list = properties.content;
              }

              const found = list.find((p: any) => p && Number(p.id) === Number(id));
              if (found) {
                console.log('Homely Detail Page - Encontrado en la lista del backend cargada en segundo plano!');
                this.mapPropertyData(found);
              } else {
                console.warn(`Homely Detail Page - ID ${id} no encontrado en el listado. Cargando fallback simulado.`);
                this.loadFallbackMock(Number(id));
              }
            } catch (err) {
              console.error('Homely Detail Page - Excepción parseando respuesta del backend:', err);
              this.loadFallbackMock(Number(id));
            }
          },
          error: (err: any) => {
            console.warn('Homely Detail Page - Error al obtener listado completo, cargando fallback simulado:', err);
            this.loadFallbackMock(Number(id));
          }
        });
      }
    });
  }

  private mapPropertyData(data: any): void {
    try {
      // Formateador de imágenes
      const formatImageUrl = (url: string): string => {
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
      };

      // Mapear imágenes dinámicas de tu JSON
      let uiImages: string[] = [];
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        if (typeof data.images[0] === 'object') {
          const sortedImgs = [...data.images].sort((a: any, b: any) => (a.displayOrder || 999) - (b.displayOrder || 999));
          uiImages = sortedImgs.map((img: any) => {
            if (img && typeof img === 'object' && img.imageUrl) {
              return formatImageUrl(img.imageUrl);
            } else if (typeof img === 'string') {
              return formatImageUrl(img);
            }
            return '/assets/img/house-placeholder.jpg';
          });
        } else {
          uiImages = data.images.map((img: string) => formatImageUrl(img));
        }
      } else if (data.imageUrl || data.image) {
        uiImages = [formatImageUrl(data.imageUrl || data.image)];
      } else {
        uiImages = ['/assets/img/house-placeholder.jpg'];
      }

      // Mapear ubicación
      let locationStr = 'Ubicación';
      if (data.address) {
        if (typeof data.address === 'object') {
          const parts = [];
          if (data.address.street) {
            let streetName = data.address.street;
            if (data.address.number) {
              streetName += ` ${data.address.number}`;
            }
            parts.push(streetName);
          }
          if (data.address.city) parts.push(data.address.city);
          if (data.address.province) parts.push(data.address.province);
          if (parts.length > 0) {
            locationStr = parts.join(', ');
          }
        } else if (typeof data.address === 'string') {
          locationStr = data.address;
        }
      } else if (data.location) {
        locationStr = data.location;
      }

      // Mapear los extras/características del array exacto de tu JSON
      const uiFeatures: string[] = [];
      if (data.extras && Array.isArray(data.extras)) {
        data.extras.forEach((ext: any) => {
          if (ext && ext.name) {
            const capitalized = ext.name.charAt(0).toUpperCase() + ext.name.slice(1);
            uiFeatures.push(capitalized);
          } else if (typeof ext === 'string') {
            uiFeatures.push(ext);
          }
        });
      }
      if (Array.isArray(data.features)) {
        data.features.forEach((f: any) => {
          if (typeof f === 'string') {
            uiFeatures.push(f);
          } else if (f && f.name) {
            uiFeatures.push(f.name);
          }
        });
      }
      if (uiFeatures.length === 0) {
        uiFeatures.push('Calefacción', 'Suelo Radiante', 'Aire Concondicionado');
      }

      // Mapear datos del usuario/agente
      let agentName = 'Elena Rodríguez';
      if (typeof data.user === 'string' && data.user) {
        agentName = data.user;
      } else if (data.user && typeof data.user === 'object') {
        agentName = data.user.name || (data.user.firstName ? `${data.user.firstName} ${data.user.lastName || ''}`.trim() : '') || agentName;
      } else if (data.agent) {
        agentName = data.agent.name || agentName;
      }

      this.property = {
        id: Number(data.id),
        title: data.title || 'Propiedad sin título',
        price: Number(data.price) || 0,
        location: locationStr,
        description: data.description || data.descripcion || 'No hay descripción disponible para esta propiedad.',
        images: uiImages,
        beds: data.residence?.bedrooms || data.beds || data.habitaciones || 0,
        baths: data.residence?.bathrooms || data.baths || data.banos || 0,
        sqft: data.surface || data.sqft || data.metros || 0,
        features: uiFeatures,
        type: (data.type || data.residence?.type || data.tipoVivienda || 'VIVIENDA').toUpperCase(),
        status: (data.transaction || data.operacion || data.status || 'EN VENTA').toUpperCase() === 'ALQUILER' ? 'ALQUILER' : 'EN VENTA',
        agent: {
          name: agentName,
          phone: '+34 600 000 000',
          email: 'info@homely.com',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop'
        }
      };
      this.activeImageIndex = 0;
    } catch (err) {
      console.error('Homely Detail Page - Error mapeando datos del objeto de búsqueda:', err);
      this.loadFallbackMock(Number(data?.id || 0));
    }
  }

  private loadFallbackMock(id: number): void {
    this.property = {
      id: id,
      title: 'Villa Esmeralda - Lujo y Diseño Moderno',
      price: 1450000,
      location: 'Urbanización La Finca, Pozuelo de Alarcón, Madrid',
      description: 'Esta impresionante villa contemporánea redefine el lujo en una de las zonas más exclusivas de Madrid. Con líneas arquitectónicas limpias y grandes ventanales de suelo a techo, la propiedad se integra perfectamente con su entorno natural.\n\nLa planta principal cuenta con un gran salón de doble altura, comedor formal, cocina de diseño con isla central y acceso directo a la piscina infinita. En la planta superior encontramos la suite principal con vestidor y terraza privada con vistas panorámicas.',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1471&auto=format&fit=crop'
      ],
      beds: 5,
      baths: 4,
      sqft: 520,
      features: [
        'Piscina Infinita',
        'Sistema Smart Home',
        'Seguridad 24h',
        'Gimnasio Privado',
        'Bodega Climatizada',
        'Garaje para 4 coches',
        'Suelo Radiante',
        'Jardín Paisajista'
      ],
      type: 'VILLA',
      status: 'EN VENTA',
      agent: {
        name: 'Elena Rodríguez',
        phone: '+34 600 000 000',
        email: 'elena@homely.com',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop'
      }
    };
    this.activeImageIndex = 0;
  }
}

