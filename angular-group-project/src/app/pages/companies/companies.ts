import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service'
import { Company } from '../../models/company'

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css'
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = []
  errorMessage = ''

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCompanies()
  }

  loadCompanies() {
    this.errorMessage = ''
    this.apiService.getCompanies().subscribe({
      next: data => {
        this.companies = data
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить компании'
      }
    })
  }
}