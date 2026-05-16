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

  constructor(private http: HttpClient) {
  }

  // 1. Añadimos método para Iniciar Sesión usando la ruta del backend
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/local/login`, credentials);
  }

  oauth2login(idToken: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);
    return this.http.post<any>(
      `${environment.backendUrl}/oauth2/login`,
      {},
      { headers }
    );
  }

  // Registrar un nuevo usuario
  register(userData: any): Observable<any> {
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

  // Actualizar perfil (PUT /api/user/profile)
  updateUserProfile(name?: string, avatarFile?: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    if (name) {
      // Usamos un Blob para el String si es @RequestPart en el back
      formData.append('name', new Blob([name], { type: 'application/json' }));
    }
    if (avatarFile) {
      formData.append('avatarFile', avatarFile);
    }

    return this.http.put<any>(`${this.baseUrl}/profile`, formData, { headers });
  }

  // Cambiar contraseña (PUT /api/user/password)
  updateUserPassword(passwordData: { password: string; confirmedPassword: string }): Observable<any> {
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
