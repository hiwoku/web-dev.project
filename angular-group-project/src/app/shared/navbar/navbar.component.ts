import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  searchQuery = '';
  authService = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/courses'], { queryParams: { search: this.searchQuery } });
    }
  }

  onLogout(): void {
    this.api.logout().subscribe({
      next: () => this.authService.logout(),
      error: () => this.authService.logout()
    });
    this.router.navigate(['/home']);
  }
}