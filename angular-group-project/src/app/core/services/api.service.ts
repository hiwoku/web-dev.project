import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Course, LoginResponse, EnrollmentResponse } from '../../models/course.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // --- Auth ---
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login/`, { username, password }).pipe(
      catchError(err => throwError(() => new Error(err.error?.error || 'Invalid credentials.')))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout/`, {}).pipe(
      catchError(err => throwError(() => new Error('Logout failed.')))
    );
  }

  // --- Courses ---
  getCourses(search?: string, level?: string): Observable<Course[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (level) params = params.set('level', level);
    return this.http.get<Course[]>(`${this.baseUrl}/courses/`, { params }).pipe(
      catchError(err => throwError(() => new Error('Could not load courses.')))
    );
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${id}/`).pipe(
      catchError(err => throwError(() => new Error('Course not found.')))
    );
  }

  createCourse(data: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses/`, data).pipe(
      catchError(err => throwError(() => new Error('Failed to create course.')))
    );
  }

  updateCourse(id: number, data: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${id}/`, data).pipe(
      catchError(err => throwError(() => new Error('Failed to update course.')))
    );
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/${id}/`).pipe(
      catchError(err => throwError(() => new Error('Failed to delete course.')))
    );
  }

  enrollCourse(id: number): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(`${this.baseUrl}/courses/${id}/enroll/`, {}).pipe(
      catchError(err => throwError(() => new Error('Enrollment failed.')))
    );
  }
}