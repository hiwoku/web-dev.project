import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Course, Video } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-detail.html'
})
export class CourseDetailComponent implements OnInit {
  course = signal<Course | null>(null);
  reviewText = signal('');
  reviewRating = signal(5);
  enrolling = signal(false);
  reviewError = signal('');
  activeVideo = signal<Video | null>(null);
  isLoading = signal(true);
  error = signal('');
  addingToCart = signal(false);

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.error.set('Invalid course ID.');
      this.isLoading.set(false);
      return;
    }

    this.loadCourse(id);
  }

  loadCourse(id: number): void {
    this.isLoading.set(true);
    this.error.set('');

    this.api.getCourse(id).subscribe({
      next: (c: Course) => {
        this.course.set(c);

        if (c.videos?.length) {
          const currentActive = this.activeVideo();

          if (!currentActive) {
            this.activeVideo.set(c.videos[0]);
          } else {
            const matched = c.videos.find((v: Video) => v.id === currentActive.id);
            this.activeVideo.set(matched || c.videos[0]);
          }
        } else {
          this.activeVideo.set(null);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load course.');
        this.isLoading.set(false);
      }
    });
  }

  canWatch(video: Video): boolean {
    return video.is_free_preview || (this.course()?.is_enrolled ?? false);
  }

  selectVideo(video: Video): void {
    if (this.canWatch(video)) {
      this.activeVideo.set(video);
    }
  }

  enroll(): void {
    const currentCourse = this.course();
    if (!currentCourse) return;

    this.enrolling.set(true);
    this.reviewError.set('');

    this.api.enrollCourse(currentCourse.id).subscribe({
      next: () => {
        this.loadCourse(currentCourse.id);
        this.enrolling.set(false);
      },
      error: () => {
        this.enrolling.set(false);
        this.reviewError.set('Failed to enroll in this course.');
      }
    });
  }

  addToCart(): void {
    const currentCourse = this.course();
    if (!currentCourse || currentCourse.is_in_cart) return;

    this.addingToCart.set(true);

    this.api.addToCart(currentCourse.id).subscribe({
      next: () => {
        this.course.update((course) =>
          course ? { ...course, is_in_cart: true } : course
        );
        this.addingToCart.set(false);
      },
      error: () => {
        this.addingToCart.set(false);
      }
    });
  }

  submitReview(): void {
    const currentCourse = this.course();
    if (!currentCourse) return;

    if (!currentCourse.is_enrolled) {
      this.reviewError.set('You must be enrolled to review this course.');
      return;
    }

    this.api.addReview({
      course: currentCourse.id,
      rating: this.reviewRating(),
      comment: this.reviewText(),
      review_type: 'course'
    }).subscribe({
      next: (review: any) => {
        this.course.update((course) => {
          if (!course) return course;

          const updatedReviews = [...(course.reviews || []), review];
          const average =
            updatedReviews.length > 0
              ? Number(
                  (
                    updatedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
                    updatedReviews.length
                  ).toFixed(1)
                )
              : 0;

          return {
            ...course,
            reviews: updatedReviews,
            average_rating: average
          };
        });

        this.reviewText.set('');
        this.reviewRating.set(5);
        this.reviewError.set('');
      },
      error: (err) => {
        this.reviewError.set(
          err.error?.error || 'You must be enrolled to review this course.'
        );
      }
    });
  }
}