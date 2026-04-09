import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = ''
  password = ''
  errorMessage = ''

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  submitLogin() {
    this.errorMessage = ''
    this.apiService.login(this.email, this.password).subscribe({
      next: response => {
        this.authService.setToken(response.access)
        this.router.navigate(['/'])
      },
      error: () => {
        this.errorMessage = 'Неверный email или пароль'
      }
    })
  }
}