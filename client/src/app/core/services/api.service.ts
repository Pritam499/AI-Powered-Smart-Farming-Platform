import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  private get headers() {
    const token = localStorage.getItem('auth_token');
    return token 
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
  get<T>(url: string) {
    return this.http.get<T>(`${environment.apiUrl}${url}`, this.headers);
  }
  post<T>(url: string, body: any) {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body, this.headers);
  }
}
