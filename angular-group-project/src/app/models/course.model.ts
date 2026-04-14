export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: number | null;
  category_name: string | null;
  instructor: number;
  instructor_name: string;
  average_rating: number | null;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  user_id: number;
}

export interface EnrollmentResponse {
  id: number;
  user: number;
  course: number;
  course_title: string;
  enrolled_at: string;
}