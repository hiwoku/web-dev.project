import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { Course } from '../models/course'
import { Company } from '../models/company'
import { News } from '../models/news'
import { AuthResponse } from '../models/auth-response'
import { UserRegister } from '../models/user-register'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/`); 
  }

  getCourses(search: string = ''): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/?search=${search}`)
  }

  enrollToCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/enroll/`, {})
  }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/companies/`)
  }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news/`)
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, {
      email,
      password
    })
  }

  register(data: UserRegister): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, data)
  }
}