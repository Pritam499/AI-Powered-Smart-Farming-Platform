import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'try', loadComponent: () => import('./pages/try/try').then(m => m.TryComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'verify-otp', loadComponent: () => import('./auth/verify-otp/verify-otp').then(m => m.VerifyOtpComponent) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
