import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCourses(params?: any): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<any[]>(`${this.BASE_URL}/courses/`, { params: httpParams });
  }

  getCourse(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/courses/${id}/`);
  }

  createCourse(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/courses/`, data);
  }

  updateCourse(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/courses/${id}/`, data);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/courses/${id}/`);
  }

  enrollCourse(id: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/courses/${id}/enroll/`, {});
  }

  purchaseCourse(id: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/courses/${id}/purchase/`, {});
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/companies/`);
  }

  getCompany(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/companies/${id}/`);
  }

  createCompany(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/companies/`, data);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/categories/`);
  }

  addReview(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/reviews/`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/auth/profile/`);
  }

  addToCart(courseId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/cart/${courseId}/add/`, {});
  }

  removeFromCart(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/auth/cart/${courseId}/remove/`);
  }
}