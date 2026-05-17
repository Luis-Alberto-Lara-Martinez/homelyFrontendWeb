import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Users } from '../../services/users/users';

interface FavoriteProperty {
  id: number;
  title: string;
  price: number;
  location: string;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  tag: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Encabezado -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Mis Favoritos</h1>
            <p class="text-gray-500 mt-1">Propiedades que has guardado para revisar más tarde.</p>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
            {{ favorites.length }} Propiedades guardadas
          </div>
        </div>

        <!-- Rejilla de Favoritos -->
        <div *ngIf="favorites.length > 0; else emptyState" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          <div *ngFor="let prop of favorites" class="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <!-- Imagen -->
            <div class="relative h-64 overflow-hidden">
              <img [src]="prop.image" [alt]="prop.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div class="absolute top-4 left-4">
                <span class="bg-white/90 backdrop-blur-md text-brand-blue text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {{ prop.tag }}
                </span>
              </div>
              <button (click)="removeFavorite(prop.id)" class="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <!-- Contenido -->
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-xl text-gray-900 group-hover:text-brand-blue transition-colors leading-tight">{{ prop.title }}</h3>
                <span class="text-2xl font-black text-brand-blue">{{ prop.price | currency:'EUR':'symbol':'1.0-0' }}</span>
              </div>
              <p class="text-gray-500 text-sm flex items-center gap-1 mb-6">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ prop.location }}
              </p>

              <!-- Características -->
              <div class="flex items-center justify-between py-4 border-t border-gray-50">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-brand-blue transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-600">{{ prop.beds }} Hab.</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-brand-blue transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-600">{{ prop.baths }} Baños</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-brand-blue transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-600">{{ prop.sqft }} m²</span>
                </div>
              </div>

              <!-- Botón Ver Detalles -->
              <a [routerLink]="['/propiedad', prop.id]" [state]="{ property: prop }" class="mt-4 block w-full bg-gray-900 text-white text-center py-3.5 rounded-xl font-bold hover:bg-brand-blue transition-all active:scale-95 shadow-lg shadow-gray-200">
                Ver Propiedad
              </a>
            </div>
          </div>
        </div>

        <!-- Estado Vacío -->
        <ng-template #emptyState>
          <div class="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 max-w-2xl mx-auto mt-12 animate-fade-in">
            <div class="w-24 h-24 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Tu lista está vacía</h2>
            <p class="text-gray-500 mb-8 max-w-sm mx-auto">Parece que aún no has guardado ninguna propiedad. ¡Explora nuestro catálogo y guarda las que más te gusten!</p>
            <a routerLink="/propiedades" class="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-blue/30 active:scale-95">
              Explorar Propiedades
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .bg-gradient-brand {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteProperty[] = [
    {
      id: 1,
      title: 'Villa Moderna en Puerta de Hierro',
      price: 1250000,
      location: 'Madrid, Puerta de Hierro',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1471&auto=format&fit=crop',
      beds: 5,
      baths: 4,
      sqft: 450,
      tag: 'Lujo'
    },
    {
      id: 2,
      title: 'Ático Duplex con Vistas al Retiro',
      price: 890000,
      location: 'Madrid, Barrio de Salamanca',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop',
      beds: 3,
      baths: 2,
      sqft: 180,
      tag: 'Vistas'
    },
    {
      id: 3,
      title: 'Chalet Independiente en Majadahonda',
      price: 720000,
      location: 'Majadahonda, Madrid',
      image: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?q=80&w=1470&auto=format&fit=crop',
      beds: 4,
      baths: 3,
      sqft: 320,
      tag: 'Familiar'
    }
  ];

  constructor(public usersService: Users) { }

  ngOnInit(): void { }

  removeFavorite(id: number): void {
    this.favorites = this.favorites.filter(p => p.id !== id);
  }
}
