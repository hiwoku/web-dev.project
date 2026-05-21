import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Course, Category } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './courses.html'
})
export class CoursesComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);

  allCourses: Course[] = [];
  courses: Course[] = [];
  categories: Category[] = [];

  search = '';
  selectedCategory = '';
  selectedType: 'all' | 'free' | 'paid' = 'all';

  loading = true;

  currentPage = 1;
  pageSize = 8;

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;

    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats || [];
      },
      error: () => {
        this.categories = [];
      }
    });

    this.api.getCourses().subscribe({
      next: (data) => {
        const loadedCourses = data || [];

        setTimeout(() => {
          this.allCourses = loadedCourses;
          this.applyFilters();
          this.loading = false;
        }, 2000);
      },
      error: () => {
        setTimeout(() => {
          this.allCourses = [];
          this.courses = [];
          this.currentPage = 1;
          this.loading = false;
        }, 2000);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allCourses];
    const searchValue = this.search.trim().toLowerCase();

    if (searchValue) {
      filtered = filtered.filter((course) => {
        const title = (course.title || '').toLowerCase();
        const description = (course.description || '').toLowerCase();
        const categoryName = (course.category_name || '').toLowerCase();
        const instructor = (course.instructor_name || '').toLowerCase();
        const company = (course.company_name || '').toLowerCase();

        return (
          title.includes(searchValue) ||
          description.includes(searchValue) ||
          categoryName.includes(searchValue) ||
          instructor.includes(searchValue) ||
          company.includes(searchValue)
        );
      });
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (course) => String(course.category) === String(this.selectedCategory)
      );
    }

    if (this.selectedType === 'free') {
      filtered = filtered.filter((course) => Number(course.price) === 0);
    } else if (this.selectedType === 'paid') {
      filtered = filtered.filter((course) => Number(course.price) > 0);
    }

    this.courses = filtered;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.courses.length / this.pageSize));
  }

  get paginatedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.courses.slice(start, end);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}