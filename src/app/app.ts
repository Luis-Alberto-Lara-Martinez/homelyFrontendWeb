import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isChatOpen = false;
  showHeaderFooter = true;
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Rutas donde NO queremos que aparezca el Header y el Footer
      const hiddenRoutes = ['/login', '/registro'];
      // Comprobamos si la url actual está en la lista (ignorando parámetros como ?id=1)
      const currentUrl = event.urlAfterRedirects.split('?')[0];
      this.showHeaderFooter = !hiddenRoutes.includes(currentUrl);
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
}
