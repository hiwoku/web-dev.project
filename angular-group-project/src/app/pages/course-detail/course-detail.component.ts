import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  reviewText = '';
  reviewRating = 5;
  enrolling = false;
  reviewError = '';
  activeVideo: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCourse(id).subscribe(c => {
      this.course = c;
      this.activeVideo = c.videos?.[0] || null;
    });
  }

  canWatch(video: any): boolean {
    return video.is_free_preview || (this.course?.is_enrolled ?? false);
  }

  enroll() {
    if (!this.course) return;
    this.enrolling = true;
    this.api.enrollCourse(this.course.id).subscribe({
      next: () => { if (this.course) this.course.is_enrolled = true; this.enrolling = false; },
      error: () => this.enrolling = false
    });
  }

  addToCart() {
    if (!this.course) return;
    this.api.addToCart(this.course.id).subscribe();
  }

  submitReview() {
    if (!this.course) return;
    this.api.addReview({
      course: this.course.id,
      rating: this.reviewRating,
      comment: this.reviewText,
      review_type: 'course'
    }).subscribe({
      next: (review: any) => {
        this.course!.reviews.push(review);
        this.reviewText = '';
        this.reviewError = '';
      },
      error: (err) => {
        this.reviewError = err.error?.error || 'You must be enrolled to review this course.';
      }
    });
  }
}