import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCourses(params?: any) {
    let p = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k]) p = p.set(k, params[k]);
      });
    }
    return this.http.get<any[]>(`${this.base}/courses/`, { params: p });
  }

  getCourse(id: number) {
    return this.http.get<any>(`${this.base}/courses/${id}/`);
  }

  createCourse(data: any) {
    return this.http.post(`${this.base}/courses/`, data);
  }

  enrollCourse(id: number) {
    return this.http.post(`${this.base}/courses/${id}/enroll/`, {});
  }

  purchaseCourse(id: number) {
    return this.http.post(`${this.base}/courses/${id}/purchase/`, {});
  }

  getCompanies() {
    return this.http.get<any[]>(`${this.base}/companies/`);
  }

  getCompany(id: number) {
    return this.http.get<any>(`${this.base}/companies/${id}/`);
  }

  createCompany(data: any) {
    return this.http.post(`${this.base}/companies/`, data);
  }

  getCategories() {
    return this.http.get<any[]>(`${this.base}/categories/`);
  }

  addReview(data: any) {
    return this.http.post(`${this.base}/reviews/add/`, data);
  }

  getProfile() {
    return this.http.get<any>(`${this.base}/auth/profile/`);
  }

  addToCart(courseId: number) {
    return this.http.post(`${this.base}/auth/cart/${courseId}/add/`, {});
  }

  removeFromCart(courseId: number) {
    return this.http.delete(`${this.base}/auth/cart/${courseId}/remove/`);
  }
}