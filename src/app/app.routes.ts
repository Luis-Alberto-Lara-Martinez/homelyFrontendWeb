import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Homely - Encuentra tu hogar ideal'
  },
  {
    path: 'propiedades',
    component: PropertiesComponent,
    title: 'Homely - Propiedades'
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
    path: '**',
    redirectTo: ''
  }
];
