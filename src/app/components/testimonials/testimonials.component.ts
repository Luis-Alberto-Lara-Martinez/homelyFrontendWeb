import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  text: string;
  featured?: boolean;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './testimonials.component.html'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private isBrowser = typeof window !== 'undefined';

  testimonials: Testimonial[] = [
    {
      name: 'Carlos Torres',
      role: 'Comprador en Madrid',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Torres&background=EBF4FF&color=4B7BF5',
      text: '"Encontrar mi hogar ideal fue un proceso transparente y mágico. Me guiaron en cada trámite legal y superaron todas mis expectativas."'
    },
    {
      name: 'Ana Belén Martínez',
      role: 'Vendedora en Barcelona',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Belen&background=random&color=fff',
      text: '"Vendí mi piso en tiempo récord. El reportaje fotográfico y la atención personalizada fueron excepcionales. ¡Altamente recomendados!"',
      featured: true
    },
    {
      name: 'Javier Sánchez',
      role: 'Inversor Inmobiliario',
      avatar: 'https://ui-avatars.com/api/?name=Javier+S.&background=EBF4FF&color=4B7BF5',
      text: '"Como inversor necesito rapidez y datos precisos. Homely es el socio estratégico que me presenta oportunidades exclusivas antes que nadie."'
    },
    {
      name: 'Laura Gutiérrez',
      role: 'Alquiló en Sevilla',
      avatar: 'https://ui-avatars.com/api/?name=Laura+Gutierrez&background=FDF2F8&color=DB2777',
      text: '"Excelente trato de principio a fin. Encontraron un piso precioso adaptado a mi presupuesto y mis mascotas de forma súper ágil."'
    },
    {
      name: 'Miguel Ángel Gómez',
      role: 'Propietario en Valencia',
      avatar: 'https://ui-avatars.com/api/?name=Miguel+Gomez&background=F0FDF4&color=16A34A',
      text: '"Puse mi propiedad en gestión de alquiler y no puedo estar más tranquilo. Se encargan de todo con total transparencia y rapidez."',
      featured: true
    },
    {
      name: 'Sofía Rodríguez',
      role: 'Compradora en Málaga',
      avatar: 'https://ui-avatars.com/api/?name=Sofia+Rodriguez&background=FFF7ED&color=EA580C',
      text: '"El equipo es extraordinario. Consiguieron una hipoteca con unas condiciones excelentes que mi propio banco me había denegado."'
    }
  ];

  currentIndex: number = 0;
  slideWidth: number = 33.3333;
  private intervalId: any;

  ngOnInit() {
    this.updateSlideWidth();
    if (this.isBrowser) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  onResize() {
    this.updateSlideWidth();
  }

  updateSlideWidth() {
    if (!this.isBrowser) return;
    const width = window.innerWidth;
    if (width >= 1024) {
      this.slideWidth = 33.3333;
    } else if (width >= 768) {
      this.slideWidth = 50;
    } else {
      this.slideWidth = 100;
    }
    this.cdr.detectChanges();
  }

  get maxIndex(): number {
    return Math.max(0, this.testimonials.length - this.visibleItemsCount);
  }

  get visibleItemsCount(): number {
    if (!this.isBrowser) return 3;
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    if (this.currentIndex >= this.maxIndex) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.cdr.detectChanges();
  }

  prev() {
    if (this.currentIndex <= 0) {
      this.currentIndex = this.maxIndex;
    } else {
      this.currentIndex--;
    }
    this.cdr.detectChanges();
  }

  setCurrentIndex(index: number) {
    this.currentIndex = index;
    this.cdr.detectChanges();
    this.startAutoPlay();
  }
}
