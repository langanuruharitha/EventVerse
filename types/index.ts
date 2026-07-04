// Core User Types
export type UserRole = 'customer' | 'vendor' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: Address | null;
  preferences: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string | null;
  business_description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  portfolio_images: string[];
  years_in_business: number | null;
  certifications: string[];
  service_areas: string[];
  price_range: string | null;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
  verification_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action_type: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Authentication Types
export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  profile: UserProfile | null;
  error: string | null;
}

// Export event types
export * from './events';
