// properties.service.ts (Ejemplo en Angular)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Properties {
  private baseUrl = 'http://localhost:8080/api/properties'; // Base URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todas las propiedades (asume GET /api/properties)
  getAllProperties(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}`, { headers });
  }

  // Obtener una propiedad por ID (asume GET /api/properties/{id})
  getPropertyById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers });
  }

  // Crear una nueva propiedad (asume POST /api/properties)
  createProperty(propertyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}`, propertyData, { headers });
  }

  // Actualizar una propiedad (asume PUT /api/properties/{id})
  updateProperty(id: number, propertyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/${id}`, propertyData, { headers });
  }

  // Eliminar una propiedad (asume DELETE /api/properties/{id})
  deleteProperty(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
  }
}