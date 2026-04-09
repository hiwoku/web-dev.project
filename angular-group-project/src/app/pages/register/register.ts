import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = ''
  full_name = ''
  email = ''
  password = ''
  successMessage = ''
  errorMessage = ''

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  submitRegister() {
    this.successMessage = ''
    this.errorMessage = ''

    this.apiService.register({
      username: this.username,
      full_name: this.full_name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.successMessage = 'Регистрация прошла успешно'
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 1000)
      },
      error: () => {
        this.errorMessage = 'Не удалось зарегистрироваться'
      }
    })
  }
}