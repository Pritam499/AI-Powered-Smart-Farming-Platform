import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  name = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // token contains the user info—or you could fetch /auth/me
    // for simplicity assume name was stored somewhere; else call backend
    this.name = localStorage.getItem('user_name') || 'User';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
