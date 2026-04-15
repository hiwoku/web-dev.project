import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, LoginResponse, EnrollmentResponse } from './models/course.model';

@Injectable({ providedIn: 'root' })
export class DataService { // Переименовал для порядка
  private apiUrl = 'http://127.0.0.1:8000/api/items/'; 

  constructor(private http: HttpClient) {}

  // Используем Course вместо Item
  getItems(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
}