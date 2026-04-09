import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchText = '';
   userName: string | null = null;


  constructor(
    public authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.getUserData();
    }
  }

  getUserData() {
    this.apiService.getUserProfile().subscribe({
      next: (data: any) => {
        this.userName = data.username; 
      },
      error: () => {
        console.error('Не удалось загрузить данные пользователя');
      }
    });
  }

  



  goToCourses() {
    this.router.navigate(['/courses'], {
      queryParams: { search: this.searchText }
    })
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}