import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  loading = false;
  error: string| null = null;

  constructor(private auth: AuthService, private router: Router) {}

  sendOtp() {
    this.error = null;
    if (!this.email) return;
    this.loading = true;
    this.auth.sendOtp(this.email).subscribe({
      next: () => {
        this.loading = false;
        // pass email along to verify page
        this.router.navigate(['/verify-otp'], { state: { email: this.email } });
      },
      error: err => {
        this.error = err.error?.message || 'Failed to send OTP';
        this.loading = false;
      }
    });
  }
}
