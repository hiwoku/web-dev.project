
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './companies.html',
})
export class CompaniesComponent implements OnInit {
  private api = inject(ApiService);

  companies = signal<any[]>([]);
  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.api.getCompanies().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.detail || 'Failed to load companies.');
        this.isLoading.set(false);
      }
    });
  }
}