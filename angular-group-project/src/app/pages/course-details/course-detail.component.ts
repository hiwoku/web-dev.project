import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  course = signal<Course | null>(null);
  isLoading = signal(true);
  error = signal('');
  enrollMessage = signal('');
  isEnrolling = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCourse(id).subscribe({
      next: data => { this.course.set(data); this.isLoading.set(false); },
      error: err => { this.error.set(err.message); this.isLoading.set(false); }
    });
  }

  onEnroll(): void {
    const c = this.course();
    if (!c) return;
    this.isEnrolling.set(true);
    this.api.enrollCourse(c.id).subscribe({
      next: () => { this.enrollMessage.set('Successfully enrolled! 🎉'); this.isEnrolling.set(false); },
      error: err => { this.enrollMessage.set(err.message); this.isEnrolling.set(false); }
    });
  }

  getLevelColor(level: string): string {
    return { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' }[level] || '#6B7280';
  }
}