// Vendor Panel Types
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';
export type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';
export type ServiceCategory = 
  | 'event_planning' | 'decoration' | 'photography' | 'videography'
  | 'mehendi' | 'catering' | 'cake' | 'dj' | 'music_band'
  | 'venue' | 'rental' | 'makeup' | 'return_gifts';

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  business_logo: string | null;
  cover_banner: string | null;
  description: string | null;
  address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  country: string;
  contact_phone: string;
  contact_email: string;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  verification_status: VerificationStatus;
  id_proof_url: string | null;
  business_license_url: string | null;
  gst_certificate_url: string | null;
  gst_number: string | null;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  total_leads: number;
  total_bookings: number;
  completed_events: number;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
  is_featured: boolean;
  subscription_plan: SubscriptionPlan;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface VendorService {
  id: string;
  vendor_id: string;
  service_category: ServiceCategory;
  is_primary: boolean;
  description: string | null;
  starting_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorPackage {
  id: string;
  vendor_service_id: string;
  package_name: string;
  description: string | null;
  price: number;
  features: string[];
  max_guests: number | null;
  duration_hours: number | null;
  is_customizable: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 
  | 'pending' | 'contacted' | 'approved' | 'rejected' 
  | 'completed' | 'expired' | 'customer_cancelled';

export interface VendorLead {
  id: string;
  vendor_id: string;
  customer_id: string;
  event_id: string | null;
  event_type: string;
  event_date: string;
  guest_count: number | null;
  budget_min: number | null;
  budget_max: number | null;
  location: string | null;
  service_requested: string;
  special_requirements: string | null;
  customer_message: string | null;
  status: LeadStatus;
  contacted_at: string | null;
  responded_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  vendor_response: string | null;
  proposed_price: number | null;
  last_message_at: string | null;
  source: string;
  conversion_probability: number | null;
  created_at: string;
  expires_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface VendorBooking {
  id: string;
  vendor_id: string;
  customer_id: string;
  lead_id: string | null;
  event_id: string | null;
  package_id: string | null;
  service_type: string;
  event_date: string;
  event_end_date: string | null;
  guest_count: number | null;
  venue_address: string | null;
  total_amount: number;
  advance_amount: number | null;
  advance_paid: boolean;
  advance_paid_at: string | null;
  balance_amount: number | null;
  balance_paid: boolean;
  balance_paid_at: string | null;
  contract_url: string | null;
  contract_signed_by_vendor: boolean;
  contract_signed_by_customer: boolean;
  contract_signed_at: string | null;
  terms_accepted: boolean;
  status: BookingStatus;
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  completed_at: string | null;
  notes: string | null;
  custom_requirements: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface VendorReview {
  id: string;
  vendor_id: string;
  customer_id: string;
  booking_id: string | null;
  rating: number;
  title: string | null;
  review_text: string;
  pros: string | null;
  cons: string | null;
  communication_rating: number | null;
  quality_rating: number | null;
  value_rating: number | null;
  professionalism_rating: number | null;
  images: string[];
  vendor_response: string | null;
  vendor_responded_at: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_approved: boolean;
  is_spam: boolean;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
}

export type PortfolioMediaType = 'image' | 'video';
export type EventCategory = 
  | 'wedding' | 'birthday' | 'engagement' | 'baby_shower'
  | 'housewarming' | 'corporate' | 'college' | 'festival'
  | 'retirement' | 'anniversary' | 'other';

export interface VendorPortfolio {
  id: string;
  vendor_id: string;
  media_type: PortfolioMediaType;
  media_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  event_category: EventCategory;
  service_category: string | null;
  tags: string[];
  view_count: number;
  save_count: number;
  share_count: number;
  leads_generated: number;
  is_featured: boolean;
  is_approved: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 
  | 'new_lead' | 'lead_response' | 'booking_confirmed' | 'booking_cancelled'
  | 'new_review' | 'payment_received' | 'verification_approved'
  | 'verification_rejected' | 'profile_incomplete' | 'subscription_expiring';

export interface VendorNotification {
  id: string;
  vendor_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_lead_id: string | null;
  related_booking_id: string | null;
  related_review_id: string | null;
  action_url: string | null;
  action_label: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface VendorAnalytics {
  id: string;
  vendor_id: string;
  date: string;
  profile_views: number;
  portfolio_views: number;
  leads_received: number;
  leads_accepted: number;
  leads_rejected: number;
  bookings_confirmed: number;
  bookings_completed: number;
  revenue_earned: number;
  avg_response_time_hours: number | null;
  conversion_rate: number | null;
  created_at: string;
}

// Dashboard Stats Type
export interface VendorDashboardStats {
  totalLeads: number;
  leadsChange: number;
  pendingLeads: number;
  totalBookings: number;
  bookingsChange: number;
  activeBookings: number;
  monthlyRevenue: number;
  revenueChange: number;
  averageRating: number;
  ratingChange: number;
  upcomingEvents: Array<{
    id: string;
    eventType: string;
    date: string;
    customer: string;
    daysUntil: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}
