import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { CoursesComponent } from './pages/courses/courses.component'
import { CompaniesComponent } from './pages/companies/companies'
import { LoginComponent } from './pages/login/login'
import { RegisterComponent } from './pages/register/register'

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
]