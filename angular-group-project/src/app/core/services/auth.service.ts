import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private TOKEN_KEY = 'edufinder_token';
  private USERNAME_KEY = 'edufinder_username';

  isLoggedIn = signal<boolean>(this.hasToken());
  currentUsername = signal<string>(this.getUsername());

  saveAuth(token: string, username: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USERNAME_KEY, username);
    this.isLoggedIn.set(true);
    this.currentUsername.set(username);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this.isLoggedIn.set(false);
    this.currentUsername.set('');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getUsername(): string {
    return localStorage.getItem(this.USERNAME_KEY) || '';
  }
}