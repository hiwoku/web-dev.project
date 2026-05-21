import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.html'
})
export class PaymentComponent implements OnInit {
  courseId!: number;
  course = signal<any | null>(null);

  cardNumber = '';
  cardHolder = '';
  expiry = '';
  cvv = '';

  loading = signal(false);
  success = signal(false);
  error = signal('');
  pageLoading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.courseId || isNaN(this.courseId)) {
      this.error.set('Invalid course ID.');
      this.pageLoading.set(false);
      return;
    }

    this.api.getCourse(this.courseId).subscribe({
      next: (courseData) => {
        this.course.set(courseData);
        this.pageLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load course.');
        this.pageLoading.set(false);
      }
    });
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  private isValidCardHolder(): boolean {
    return this.cardHolder.trim().length >= 3;
  }

  private isValidCardNumber(): boolean {
    const digits = this.onlyDigits(this.cardNumber);
    return digits.length === 16;
  }

  private isValidExpiry(): boolean {
    const value = this.expiry.trim();

    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return false;
    }

    const [monthStr, yearStr] = value.split('/');
    const month = Number(monthStr);
    const year = Number(yearStr);

    if (month < 1 || month > 12) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) {
      return false;
    }

    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  }

  private isValidCvv(): boolean {
    const digits = this.onlyDigits(this.cvv);
    return digits.length === 3;
  }

  private validateForm(): boolean {
    if (!this.cardHolder.trim() || !this.cardNumber.trim() || !this.expiry.trim() || !this.cvv.trim()) {
      this.error.set('Please fill in all payment fields.');
      return false;
    }

    if (!this.isValidCardHolder()) {
      this.error.set('Cardholder name must be at least 3 characters.');
      return false;
    }

    if (!this.isValidCardNumber()) {
      this.error.set('Card number must contain 16 digits.');
      return false;
    }

    if (!this.isValidExpiry()) {
      this.error.set('Enter a valid expiry date in MM/YY format.');
      return false;
    }

    if (!this.isValidCvv()) {
      this.error.set('CVV must contain 3 digits.');
      return false;
    }

    this.error.set('');
    return true;
  }

  pay(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    setTimeout(() => {
      this.api.purchaseCourse(this.courseId).subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.error || 'Payment failed. Please try again.');
        }
      });
    }, 1200);
  }
}