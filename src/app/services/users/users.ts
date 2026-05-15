// users.service.ts (Ejemplo en Angular)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Users {
  // Usamos el entorno para que coja http://localhost:8080/api/user
  private baseUrl = environment.backendUrl + '/api/user';

  constructor(private http: HttpClient) { }

  // 1. Añadimos método para Iniciar Sesión usando la ruta del backend
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/local/login`, credentials);
  }

  // Registrar un nuevo usuario
  register(userData: { nombre: string; apellidos: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/local/register`, userData);
  }

  // 2. Añadimos método robusto para verificar si el usuario tiene sesión iniciada
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('token');
      // Verificamos que sea válido y no sean textos 'null' residuales
      return !!token && token !== 'null' && token !== 'undefined';
    } catch (e) {
      // Evita errores en SSR (Server-Side Rendering)
      return false;
    }
  }

  // Obtener perfil del usuario autenticado (GET /api/user/profile)
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/profile`, { headers });
  }

  // Actualizar perfil (PUT /api/user/profile, con avatar opcional)
  updateUserProfile(profileData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/profile`, profileData, { headers });
  }

  // Cambiar contraseña (PUT /api/user/password)
  updateUserPassword(passwordData: { oldPassword: string; newPassword: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/password`, passwordData, { headers });
  }

  // Obtener todos los usuarios (para admin, GET /admin/users - si está habilitado)
  getAllUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/admin/users`, { headers });
  }
}