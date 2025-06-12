import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.html'
})
export class VerifyOtpComponent {
  email: string;
  otp = '';
  loading = false;
  error: string|null = null;

  constructor(private auth: AuthService, private router: Router) {
    // retrieve passed email
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras.state?.['email'] || '';
  }

  verify() {
    this.error = null;
    if (!this.email || !this.otp) return;
    this.loading = true;
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.loading = false;
        // now JWT is stored → go to signup
        this.router.navigate(['/signup']);
      },
      error: err => {
        this.error = err.error?.message || 'Invalid code';
        this.loading = false;
      }
    });
  }
}
