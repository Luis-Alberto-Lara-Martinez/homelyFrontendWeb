import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResetPassword {

  constructor(private http: HttpClient) { }

  sendResetEmail(email: string): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/forgotten-password`, { email });
  }

  checkResetToken(token: string): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/check-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmedPassword: string): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/reset-password`, { token, password, confirmedPassword });
  }
}
