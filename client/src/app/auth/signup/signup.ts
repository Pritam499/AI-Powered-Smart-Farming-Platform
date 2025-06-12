import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html'
})
export class SignupComponent {
  name = '';
  loading = false;
  error: string|null = null;

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.error = null;
    if (!this.name) return;
    this.loading = true;
    this.auth.signup(this.name).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error?.message || 'Signup failed';
        this.loading = false;
      }
    });
  }
}
