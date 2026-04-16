import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  courseId!: number;
  course: any = null;
  cardNumber = '';
  cardHolder = '';
  expiry = '';
  cvv = '';
  loading = false;
  success = false;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCourse(this.courseId).subscribe(c => this.course = c);
  }

  pay() {
    if (!this.cardNumber || !this.cardHolder || !this.expiry || !this.cvv) {
      this.error = 'Please fill in all payment fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    // Simulate 5 second payment processing
    setTimeout(() => {
      this.api.purchaseCourse(this.courseId).subscribe({
        next: () => { this.loading = false; this.success = true; },
        error: () => { this.loading = false; this.error = 'Payment failed. Try again.'; }
      });
    }, 5000);
  }
}