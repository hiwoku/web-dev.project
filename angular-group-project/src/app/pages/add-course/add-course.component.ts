import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-course.component.html'
})
export class AddCourseComponent implements OnInit {
  companies: any[] = [];
  categories: any[] = [];
  title = '';
  description = '';
  shortDescription = '';
  price = 0;
  isFree = false;
  selectedCompany = '';
  selectedCategory = '';
  level = 'beginner';
  skills = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getCompanies().subscribe(c => this.companies = c);
    this.api.getCategories().subscribe(c => this.categories = c);
  }

  submit() {
    const data = {
      title: this.title,
      description: this.description,
      short_description: this.shortDescription,
      price: this.isFree ? 0 : this.price,
      is_free: this.isFree,
      company: this.selectedCompany,
      category: this.selectedCategory,
      level: this.level,
      skills: this.skills.split(',').map(s => s.trim()).filter(Boolean)
    };
    this.api.createCourse(data).subscribe({
      next: () => this.router.navigate(['/courses']),
      error: (err) => this.error = 'Failed to create course.'
    });
  }
}