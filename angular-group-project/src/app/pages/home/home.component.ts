import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  slides = [
    'assets/images/banner1.jpg',
    'assets/images/banner2.jpg',
    'assets/images/banner3.jpg'
  ];

  currentSlide = 0;
  news: any[] = [];
  companies: any[] = [];
  errorMessage = '';
  infoMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  loadNews() {
    this.apiService.getNews().subscribe(
      data => {
        this.news = data;
        this.infoMessage = 'Новости загружены';
      },
      error => {
        this.errorMessage = 'Не удалось загрузить новости';
      }
    );
  }

  loadCompanies() {
    this.apiService.getCompanies().subscribe(
      data => {
        this.companies = data;
        this.infoMessage = 'Компании загружены';
      },
      error => {
        this.errorMessage = 'Не удалось загрузить компании';
      }
    );
  }
}