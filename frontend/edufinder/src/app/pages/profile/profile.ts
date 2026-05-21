import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Course } from '../../models/course.model';

interface ProfileView {
  username: string;
  email?: string;
  full_name?: string;
  user_type?: 'personal' | 'company' | 'user';
  enrolled_courses?: Course[];
  cart_courses?: Course[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  auth = inject(AuthService);

  user = signal<ProfileView | null>(null);
  loading = signal(true);
  error = signal('');

  isCompany = computed(() => this.user()?.user_type === 'company');
  isPersonal = computed(() => this.user()?.user_type === 'personal');

  enrolledCourses = computed(() => this.user()?.enrolled_courses ?? []);
  cartCourses = computed(() => this.user()?.cart_courses ?? []);

  ngOnInit(): void {
    this.loadLocalUser();
    this.loadProfile();
  }

  private loadLocalUser(): void {
    const raw = localStorage.getItem('user');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      this.user.set({
        username: parsed.username || '',
        email: parsed.email || '',
        full_name: parsed.full_name || `${parsed.first_name || ''} ${parsed.last_name || ''}`.trim(),
        user_type: parsed.user_type || 'user',
        enrolled_courses: [],
        cart_courses: [],
      });
    } catch {
      this.user.set(null);
    }
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getProfile().subscribe({
      next: (profile) => {
        const current = this.user();

        this.user.set({
          username: profile.username || current?.username || '',
          email: profile.email || current?.email || '',
          full_name:
            profile.full_name ||
            current?.full_name ||
            `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          user_type: profile.user_type || profile.role || current?.user_type || 'user',
          enrolled_courses: profile.enrolled_courses || [],
          cart_courses: profile.cart_courses || [],
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load profile data.');
        this.loading.set(false);
      }
    });
  }

  getDisplayName(): string {
    const current = this.user();
    if (!current) return 'User';
    return current.full_name?.trim() || current.username || 'User';
  }

  getInitials(): string {
    const name = this.getDisplayName().trim();
    if (!name) return 'U';

    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  getLevelLabel(level: string | undefined): string {
    if (!level) return 'General';
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  formatPrice(course: Course): string {
    return Number(course.price) > 0 ? `$${course.price}` : 'Free';
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}