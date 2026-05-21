import { Routes } from '@angular/router';
import { companyGuard } from './core/guards/auth-company.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'courses', loadComponent: () => import('./pages/courses/courses').then(m => m.CoursesComponent) },
  { path: 'courses/:id', loadComponent: () => import('./pages/course-detail/course-detail').then(m => m.CourseDetailComponent) },
  { path: 'companies', loadComponent: () => import('./pages/companies/companies').then(m => m.CompaniesComponent) },
  { path: 'companies/:id', loadComponent: () => import('./pages/company-detail/company-detail').then(m => m.CompanyDetail) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent) },
{
  path: 'add-course',
  canActivate: [companyGuard],
  loadComponent: () => import('./pages/add-course/add-course').then(m => m.AddCourseComponent)
},
  { path: 'payment/:id', loadComponent: () => import('./pages/payment/payment').then(m => m.PaymentComponent) },
  { path: '**', redirectTo: '' },
  { path: 'faq', loadComponent: () => import('./shared/faq/faq').then(m => m.FAQComponent) },
];