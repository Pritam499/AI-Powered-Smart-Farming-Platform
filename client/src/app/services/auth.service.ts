import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) {}

  sendOtp(email: string) {
    return this.api.post('/auth/send-otp', { email });
  }

  verifyOtp(email: string, otp: string) {
    return this.api.post<any>('/auth/verify-otp', { email, otp }).pipe(
      tap(res => localStorage.setItem('auth_token', res.data.token))
    );
  }

  signup(name: string) {
    return this.api.post<any>('/auth/signup', { name });
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
  }
}
