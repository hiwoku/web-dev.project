// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ApiService } from '../../core/services/api.service';

// @Component({
//   selector: 'app-add-course',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './add-course.html'
// })
// export class AddCourseComponent implements OnInit {
//   companies: any[] = [];
//   categories: any[] = [];
//   title = '';
//   description = '';
//   shortDescription = '';
//   price = 0;
//   isFree = false;
//   selectedCompany = '';
//   selectedCategory = '';
//   level = 'beginner';
//   skills = '';
//   error = '';
//   isSubmitting = false;

//   constructor(private api: ApiService, private router: Router) {}
//   ngOnInit() {
//     this.api.getCompanies().subscribe(c => this.companies = c);
//     this.api.getCategories().subscribe(c => this.categories = c);
//   }

//   submit() {
//   this.error = '';

//   if (!this.title.trim()) {
//     this.error = 'Course title is required.';
//     return;
//   }

//   if (!this.description.trim()) {
//     this.error = 'Full description is required.';
//     return;
//   }

//   if (!this.shortDescription.trim()) {
//     this.error = 'Short description is required.';
//     return;
//   }

//   if (!this.selectedCompany) {
//     this.error = 'Please select a company.';
//     return;
//   }

//   if (!this.selectedCategory) {
//     this.error = 'Please select a category.';
//     return;
//   }

//   if (!this.isFree && Number(this.price) <= 0) {
//     this.error = 'Please enter a valid price or mark the course as free.';
//     return;
//   }

//   const data = {
//     title: this.title,
//     description: this.description,
//     short_description: this.shortDescription,
//     price: this.isFree ? 0 : this.price,
//     is_free: this.isFree,
//     company: this.selectedCompany,
//     category: this.selectedCategory,
//     level: this.level,
//     skills: this.skills.split(',').map(s => s.trim()).filter(Boolean)
//   };

//   this.isSubmitting = true;

//   this.api.createCourse(data).subscribe({
//     next: () => {
//       this.isSubmitting = false;
//       this.router.navigate(['/courses']);
//     },
//     error: () => {
//       this.isSubmitting = false;
//       this.error = 'Failed to create course.';
//     }
//   });
// }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-course.html'
})
export class AddCourseComponent implements OnInit {
  companies: any[] = [];
  categories: any[] = [];

  title = '';
  description = '';
  instructor = '';
  price = 0;
  isFree = false;
  selectedCompany = '';
  selectedCategory = '';
  level = 'beginner';
  skills = '';
  error = '';
  isSubmitting = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getCompanies().subscribe({
      next: (c) => this.companies = c,
      error: () => this.error = 'Failed to load companies.'
    });

    this.api.getCategories().subscribe({
      next: (c) => this.categories = c,
      error: () => this.error = 'Failed to load categories.'
    });
  }

  submit() {
    this.error = '';

    if (!this.title.trim()) {
      this.error = 'Course title is required.';
      return;
    }

    if (!this.description.trim()) {
      this.error = 'Full description is required.';
      return;
    }

    if (!this.instructor.trim()) {
      this.error = 'Instructor is required.';
      return;
    }

    if (!this.selectedCompany) {
      this.error = 'Please select a company.';
      return;
    }

    if (!this.selectedCategory) {
      this.error = 'Please select a category.';
      return;
    }

    if (!this.isFree && Number(this.price) <= 0) {
      this.error = 'Please enter a valid price or mark the course as free.';
      return;
    }

    const data = {
      title: this.title.trim(),
      description: this.description.trim(),
      instructor: this.instructor.trim(),
      price: this.isFree ? 0 : Number(this.price),
      company: this.selectedCompany,
      category: this.selectedCategory,
      level: this.level
    };

    this.isSubmitting = true;

    this.api.createCourse(data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        this.error = 'Failed to create course.';
      }
    });
  }
}