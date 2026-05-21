import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
  username?: string;
  role?: 'personal' | 'company' | 'user';
  user?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    user_type?: 'personal' | 'company';
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  isLoggedIn = signal(false);
  role = signal<'personal' | 'company' | 'user'>('user');
  username = signal('');

  constructor() {
    this.loadFromStorage();
  }

  private getStorage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  private loadFromStorage(): void {
    const storage = this.getStorage();
    if (!storage) return;

    this.isLoggedIn.set(!!storage.getItem('token'));
    this.role.set((storage.getItem('role') as 'personal' | 'company' | 'user') || 'user');
    this.username.set(storage.getItem('username') || '');
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        tap((res) => {
          const storage = this.getStorage();
          const resolvedUsername = res.username || res.user?.username || '';
          const resolvedRole = res.role || res.user?.user_type || 'user';

          if (storage) {
            storage.setItem('token', res.token);
            storage.setItem('username', resolvedUsername);
            storage.setItem('role', resolvedRole);
            if (res.user) {
              storage.setItem('user', JSON.stringify(res.user));
            }
          }

          this.isLoggedIn.set(true);
          this.role.set(resolvedRole);
          this.username.set(resolvedUsername);
        })
      );
  }

  register(data: {
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password: string;
    password_confirm: string;
    user_type: 'personal' | 'company';
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register/`, data)
      .pipe(
        tap((res) => {
          const storage = this.getStorage();
          const resolvedUsername = res.username || res.user?.username || '';
          const resolvedRole = res.role || res.user?.user_type || 'user';

          if (storage) {
            storage.setItem('token', res.token);
            storage.setItem('username', resolvedUsername);
            storage.setItem('role', resolvedRole);
            if (res.user) {
              storage.setItem('user', JSON.stringify(res.user));
            }
          }

          this.isLoggedIn.set(true);
          this.role.set(resolvedRole);
          this.username.set(resolvedUsername);
        })
      );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout/`, {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  clearSession(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('token');
      storage.removeItem('username');
      storage.removeItem('role');
      storage.removeItem('user');
    }

    this.isLoggedIn.set(false);
    this.role.set('user');
    this.username.set('');
  }

  getToken(): string | null {
    return this.getStorage()?.getItem('token') || null;
  }

  isCompany(): boolean {
    return this.role() === 'company';
  }

  isPersonal(): boolean {
    return this.role() === 'personal';
  }

  getUser() {
    const raw = this.getStorage()?.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}