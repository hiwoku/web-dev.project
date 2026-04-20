import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  activeTab: 'enrolled' | 'cart' = 'enrolled';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.api.getProfile().subscribe(p => this.profile = p);
  }

  removeFromCart(courseId: number) {
    this.api.removeFromCart(courseId).subscribe(() => {
      this.profile.cart_courses = this.profile.cart_courses.filter((c: any) => c.id !== courseId);
    });
  }
}