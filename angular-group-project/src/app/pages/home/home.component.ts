import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);

  featuredCourses = signal<Course[]>([]);
  isLoading = signal(true);
  error = signal('');

  bannerSlides = [
    { title: 'Unlock Your Potential', subtitle: 'Explore thousands of courses from top instructors', bg: '#4F46E5' },
    { title: 'Learn at Your Own Pace', subtitle: 'From beginner to expert — we have a course for you', bg: '#7C3AED' },
    { title: 'Advance Your Career', subtitle: 'Industry-recognized certifications await', bg: '#2563EB' },
  ];
  currentSlide = signal(0);

  ngOnInit(): void {
    this.api.getCourses().subscribe({
      next: courses => {
        this.featuredCourses.set(courses.slice(0, 6));
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  prevSlide(): void {
    this.currentSlide.update(s => (s === 0 ? this.bannerSlides.length - 1 : s - 1));
  }

  nextSlide(): void {
    this.currentSlide.update(s => (s === this.bannerSlides.length - 1 ? 0 : s + 1));
  }

  getLevelColor(level: string): string {
    return { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' }[level] || '#6B7280';
  }
}