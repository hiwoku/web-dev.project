import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'role';

  isLoggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  role = signal<string>(localStorage.getItem(this.ROLE_KEY) || 'user');
  username = signal<string>(localStorage.getItem(this.USERNAME_KEY) || '');

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login/`, { username, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.API_URL}/register/`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    return this.http.post(`${this.API_URL}/logout/`, {}).pipe(
      tap({
        next: () => this.clearSession(),
        error: () => this.clearSession()
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(res: any): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USERNAME_KEY, res.username);
    localStorage.setItem(this.ROLE_KEY, res.role);

    this.isLoggedIn.set(true);
    this.username.set(res.username);
    this.role.set(res.role);
  }

  private clearSession(): void {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.username.set('');
    this.role.set('user');
  }
}