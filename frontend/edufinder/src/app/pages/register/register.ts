import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  form = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    user_type: 'personal' as 'personal' | 'company',
  };

  isSubmitting = signal(false);
  error = signal('');

  submit(): void {
    this.error.set('');
    this.isSubmitting.set(true);

    this.auth.register(this.form).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.error.set(this.formatErrors(err.error));
        this.isSubmitting.set(false);
      }
    });
  }

  private formatErrors(errors: any): string {
    if (!errors) return 'Registration failed.';

    const messages: string[] = [];
    Object.keys(errors).forEach((key) => {
      const value = errors[key];
      if (Array.isArray(value)) {
        messages.push(`${key}: ${value.join(', ')}`);
      } else {
        messages.push(`${key}: ${value}`);
      }
    });

    return messages.join(' | ') || 'Registration failed.';
  }
}