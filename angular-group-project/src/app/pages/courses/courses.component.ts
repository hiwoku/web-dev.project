import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Course, Category } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  allCourses: Course[] = [];
  courses: Course[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategory = '';
  selectedType: 'all' | 'free' | 'paid' = 'all';
  sortBy = '';
  pageSize = 5;
  visibleCount = 5;
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCategories().subscribe(cats => this.categories = cats);
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    const params: any = {};
    if (this.search) params['search'] = this.search;
    if (this.selectedCategory) params['category'] = this.selectedCategory;
    if (this.selectedType !== 'all') params['is_free'] = this.selectedType === 'free' ? 'true' : 'false';
    if (this.sortBy) params['sort'] = this.sortBy;
    this.api.getCourses(params).subscribe({
      next: (data) => { this.allCourses = data; this.courses = data; this.visibleCount = this.pageSize; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get visibleCourses() { return this.courses.slice(0, this.visibleCount); }
  get hasMore() { return this.visibleCount < this.courses.length; }
  get canCollapse() { return this.visibleCount > this.pageSize; }

  showMore() { this.visibleCount = Math.min(this.visibleCount + this.pageSize, this.courses.length); }
  showLess() { this.visibleCount = this.pageSize; }
  onSearch() { this.loadCourses(); }
}