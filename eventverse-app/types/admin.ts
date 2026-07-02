// Admin Panel Types
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'under_review' | 'action_taken' | 'dismissed';
export type ContentType = 'review' | 'portfolio' | 'vendor_profile' | 'user_profile';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  permissions: Record<string, any>;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  description: string;
  changes: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface PlatformStats {
  id: string;
  date: string;
  total_users: number;
  new_users_today: number;
  active_users_today: number;
  total_vendors: number;
  new_vendors_today: number;
  verified_vendors: number;
  pending_verifications: number;
  total_events: number;
  events_created_today: number;
  active_events: number;
  total_bookings: number;
  bookings_today: number;
  completed_bookings: number;
  total_revenue: number;
  revenue_today: number;
  platform_commission: number;
  avg_session_duration_minutes: number | null;
  bounce_rate: number | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string | null;
  user_type: 'customer' | 'vendor';
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  category: string;
  priority: TicketPriority;
  subject: string;
  description: string;
  attachments: string[];
  assigned_to: string | null;
  assigned_at: string | null;
  status: TicketStatus;
  related_booking_id: string | null;
  related_vendor_id: string | null;
  resolution_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  satisfaction_rating: number | null;
  satisfaction_feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  sender_type: 'customer' | 'vendor' | 'admin' | 'system';
  message: string;
  attachments: string[];
  is_internal: boolean;
  created_at: string;
}

export type TemplateType = 
  | 'invitation_card' | 'video' | 'voice' | 'budget'
  | 'checklist' | 'timeline' | 'decoration' | 'ai_prompt';

export interface PlatformTemplate {
  id: string;
  template_name: string;
  template_type: TemplateType;
  category: string;
  template_data: Record<string, any>;
  preview_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  tags: string[];
  event_types: string[];
  is_active: boolean;
  is_featured: boolean;
  is_premium: boolean;
  display_order: number;
  usage_count: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reporter_type: 'customer' | 'vendor';
  content_type: ContentType;
  content_id: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  action_taken: string | null;
  created_at: string;
}

export type SettingType = 'general' | 'email' | 'payment' | 'ai' | 'security' | 'notification';

export interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: SettingType;
  description: string | null;
  is_public: boolean;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
}

// Dashboard Stats Type
export interface AdminDashboardStats {
  overview: {
    totalUsers: number;
    usersChange: number;
    totalVendors: number;
    vendorsChange: number;
    totalEvents: number;
    eventsChange: number;
    totalRevenue: number;
    revenueChange: number;
  };
  pendingActions: {
    vendorVerifications: number;
    supportTickets: number;
    contentReports: number;
    contentApprovals: number;
  };
  charts: {
    userGrowth: Array<{ date: string; count: number }>;
    revenueChart: Array<{ month: string; revenue: number }>;
    eventTypeDistribution: Array<{ type: string; count: number; percentage: number }>;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    admin?: string;
  }>;
}

// Analytics Types
export interface VendorPerformance {
  vendor_id: string;
  business_name: string;
  total_bookings: number;
  completed_bookings: number;
  total_revenue: number;
  average_rating: number;
  total_reviews: number;
  response_time_hours: number;
  conversion_rate: number;
}

export interface RevenueAnalytics {
  summary: {
    totalRevenue: number;
    platformCommission: number;
    vendorPayouts: number;
    growth: number;
  };
  byMonth: Array<{
    month: string;
    revenue: number;
    commission: number;
    bookings: number;
  }>;
  byService: Array<{
    service: string;
    revenue: number;
    bookings: number;
  }>;
  topVendors: Array<{
    vendor_id: string;
    business_name: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface UserActivityMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  avgSessionDuration: number;
  bounceRate: number;
  topLocations: Array<{
    city: string;
    state: string;
    users: number;
  }>;
  userSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
}
