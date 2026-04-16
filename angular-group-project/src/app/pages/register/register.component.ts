import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role: 'user' | 'company_rep' = 'user';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register({ username: this.username, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (err) => this.error = err.error?.error || 'Registration failed.'
      });
  }
}