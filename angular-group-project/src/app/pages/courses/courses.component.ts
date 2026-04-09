import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '../../services/api.service'
import { Course } from '../../models/course'

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  search = ''
  courses: Course[] = []
  errorMessage = ''
  successMessage = ''

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.search = params['search'] || ''
      this.searchCourses()
    })
  }

  searchCourses() {
    this.errorMessage = ''
    this.successMessage = ''
    this.apiService.getCourses(this.search).subscribe({
      next: data => {
        this.courses = data
        this.successMessage = 'Курсы загружены'
      },
      error: () => {
        this.errorMessage = 'Ошибка при загрузке курсов'
      }
    })
  }

  enroll(courseId: number) {
    this.errorMessage = ''
    this.successMessage = ''
    this.apiService.enrollToCourse(courseId).subscribe({
      next: () => {
        this.successMessage = 'Вы успешно записались на курс'
      },
      error: () => {
        this.errorMessage = 'Не удалось записаться на курс'
      }
    })
  }
}