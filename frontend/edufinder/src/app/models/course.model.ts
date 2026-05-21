export interface Category { id: number; name: string; }

export interface Video {
  id: number;
  title: string;
  video_url: string;
  order: number;
  is_free_preview: boolean;
}

export interface Review {
  id: number;
  user: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
  review_type: 'course' | 'company';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  short_description: string;
  price: number;
  is_free: boolean;
  category: number;
  category_name: string;
  company: number;
  company_name: string;
  level: string;
  duration_hours: number;
  skills: string[];
  thumbnail: string;
  average_rating: number;
  videos: Video[];
  reviews: Review[];
  is_enrolled: boolean;
  is_in_cart: boolean;
  created_at: string;
  instructor_name: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  average_rating: number;
  courses_count: number;
  reviews: Review[];
  courses: Course[];
}

export interface UserProfile {
  username: string;
  email: string;
  role: string;
  enrolled_courses: Course[];
  cart_courses: Course[];
}