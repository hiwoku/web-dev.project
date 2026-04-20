export interface Category { id: number; name: string; }
export interface Video {
  id: number; title: string; video_url: string;
  order: number; is_free_preview: boolean;
}

export interface Course {
  id: number; title: string; description: string;
  short_description: string; price: number; is_free: boolean;
  category: number; category_name: string;
  company: number; company_name: string;
  level: string; duration_hours: number; skills: string[];
  thumbnail: string; average_rating: number;
  videos: Video[]; reviews: Review[];
  is_enrolled: boolean; created_at: string;
}

export interface Review {
  id: number; user: number; username: string;
  rating: number; comment: string; created_at: string;
  review_type: 'course' | 'company';
}

export interface Company {
  id: number; name: string; description: string;
  logo: string; website: string; average_rating: number;
  courses_count: number; reviews: Review[];
}

export interface UserProfile {
  username: string; email: string; role: string;
  enrolled_courses: Course[]; cart_courses: Course[];
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