import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { CalculadoraComponent } from './pages/calculadora/calculadora.component';

export const routes: Routes = [
  {
    path: 'calculadora',
    component: CalculadoraComponent,
    title: 'Homely - Calculadora de Hipotecas'
  },
  {
    path: 'vender',
    component: VentasComponent,
    title: 'Homely - Publica tu anuncio'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Homely - Encuentra tu hogar ideal'
  },
  {
    path: 'comprar-alquilar',
    component: PropertiesComponent,
    title: 'Homely - Comprar/Alquilar'
  },
  {
    path: 'nosotros',
    component: AboutComponent,
    title: 'Homely - Sobre Nosotros'
  },
  {
    path: 'contacto',
    component: ContactComponent,
    title: 'Homely - Contacto'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Homely - Iniciar Sesión'
  },
  {
    path: 'registro',
    component: RegistroComponent,
    title: 'Homely - Crear Cuenta'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
