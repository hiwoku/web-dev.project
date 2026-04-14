import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  isLoading = signal(true);
  error = signal('');
  searchQuery = signal('');
  levelFilter = signal('');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery.set(params['search'] || '');
      this.loadCourses();
    });
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.error.set('');
    this.api.getCourses(this.searchQuery(), this.levelFilter()).subscribe({
      next: data => { this.courses.set(data); this.isLoading.set(false); },
      error: err => { this.error.set(err.message); this.isLoading.set(false); }
    });
  }

  onSearch(): void { this.loadCourses(); }

  onLevelChange(level: string): void {
    this.levelFilter.set(level);
    this.loadCourses();
  }

  getLevelColor(level: string): string {
    return { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' }[level] || '#6B7280';
  }
}