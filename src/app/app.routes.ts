import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { CalculadoraComponent } from './pages/calculadora/calculadora.component';
import { authGuard } from './guards/auth-guard'; // Importamos el Guard
import { ProfileComponent } from './pages/profile/profile.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { PropertyDetailsComponent } from './pages/property-details/property-details.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { TrabajaConNosotrosComponent } from './pages/trabaja-con-nosotros/trabaja-con-nosotros.component';

export const routes: Routes = [
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Homely - Recuperar Contraseña'
  },
  {
    path: 'trabaja-con-nosotros',
    component: TrabajaConNosotrosComponent,
    canActivate: [authGuard],
    title: 'Homely - Trabaja con Nosotros'
  },
  {
    path: 'propiedad/:id',
    component: PropertyDetailsComponent,
    canActivate: [authGuard],
    title: 'Homely - Detalles de Propiedad'
  },
  {
    path: 'mi-cuenta',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'Homely - Mi Cuenta'
  },
  {
    path: 'favoritos',
    component: FavoritesComponent,
    canActivate: [authGuard],
    title: 'Homely - Mis Favoritos'
  },
  {
    path: 'calculadora',
    component: CalculadoraComponent,
    canActivate: [authGuard], // ← ¡Protegida por el guard!
    title: 'Homely - Calculadora de Hipotecas'
  },
  {
    path: 'vender',
    component: VentasComponent,
    canActivate: [authGuard], // ← Protegida
    title: 'Homely - Publica tu anuncio'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard], // ← Protegida
    title: 'Homely - Encuentra tu hogar ideal'
  },
  {
    path: 'comprar-alquilar',
    component: PropertiesComponent,
    canActivate: [authGuard], // ← Protegida
    title: 'Homely - Comprar/Alquilar'
  },
  {
    path: 'nosotros',
    component: AboutComponent,
    canActivate: [authGuard], // ← Protegida
    title: 'Homely - Sobre Nosotros'
  },
  {
    path: 'contacto',
    component: ContactComponent,
    canActivate: [authGuard], // ← Protegida
    title: 'Homely - Contacto'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Homely - Iniciar Sesión'
    // IMPORTANTE: Aquí NO ponemos canActivate, porque sino nadie podría entrar a loguearse
  },
  {
    path: 'registro',
    component: RegistroComponent,
    title: 'Homely - Crear Cuenta'
    // IMPORTANTE: Aquí NO ponemos canActivate
  },
  {
    path: '',
    redirectTo: 'home', // Al entrar a la raíz, redirigimos a home (que está protegida)
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login', // Cualquier ruta rara manda al login
    pathMatch: 'full'
  }
];
