import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'courses', loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent) },
  { path: 'courses/:id', loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: 'companies', loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent) },
  { path: 'companies/:id', loadComponent: () => import('./pages/company-detail/company-detail.component').then(m => m.CompanyDetailComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'add-course', loadComponent: () => import('./pages/add-course/add-course.component').then(m => m.AddCourseComponent) },
  { path: 'payment/:id', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'users/:username', loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: '**', redirectTo: '' }
];