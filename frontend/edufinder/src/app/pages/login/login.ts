
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  form = {
    username: '',
    password: '',
  };

  isSubmitting = signal(false);
  error = signal('');

  submit(): void {
    this.error.set('');
    this.isSubmitting.set(true);

    this.auth.login(this.form.username, this.form.password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Login failed.');
        this.isSubmitting.set(false);
      }
    });
  }
}