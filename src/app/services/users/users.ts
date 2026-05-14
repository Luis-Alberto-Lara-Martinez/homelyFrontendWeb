// users.service.ts (Ejemplo en Angular)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private baseUrl = 'http://localhost:8080/api/user'; // Base URL del backend

  constructor(private http: HttpClient) {}

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