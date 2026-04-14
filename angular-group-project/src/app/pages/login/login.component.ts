import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  isLoading = signal(false);
  error = signal('');

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error.set('Please enter both username and password.');
      return;
    }
    this.isLoading.set(true);
    this.error.set('');

    this.api.login(this.username, this.password).subscribe({
      next: res => {
        this.authService.saveAuth(res.token, res.username);
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}