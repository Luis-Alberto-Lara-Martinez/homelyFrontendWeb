import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Properties } from '../../services/properties/properties';

const GENERIC_AGENT_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232563eb"/><stop offset="100%" stop-color="%231d4ed8"/></linearGradient></defs><rect width="128" height="128" rx="32" fill="url(%23g)"/><path d="M64 28 L32 56 V96 H96 V56 Z" fill="white" opacity="0.15"/><path d="M64 22 L24 54 L32 60 L64 34 L96 60 L104 54 Z" fill="white"/><rect x="52" y="66" width="24" height="30" rx="6" fill="white"/><circle cx="64" cy="46" r="6" fill="white" opacity="0.8"/></svg>';

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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './property-details.component.html',
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

  // Formulario de contacto
  contactData = {
    name: '',
    email: '',
    message: ''
  };
  isSubmitted: boolean = false;

  submitContactForm(form: NgForm) {
    if (form.valid) {
      console.log('Contacto enviado (simulado):', this.contactData);
      this.isSubmitted = true;
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  resetContactForm(form?: NgForm) {
    this.isSubmitted = false;
    this.contactData = {
      name: '',
      email: '',
      message: ''
    };
    if (form) {
      form.resetForm();
    }
  }

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
      this.propertiesLink = '/propiedades';
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
          image: GENERIC_AGENT_IMAGE
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
        image: GENERIC_AGENT_IMAGE
      }
    };
    this.activeImageIndex = 0;
  }
}

