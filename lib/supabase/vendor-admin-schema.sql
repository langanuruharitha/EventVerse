-- ============================================================================
-- EventVerse: Vendor & Admin Panel Database Schema
-- ============================================================================
-- This schema creates all tables for Vendor Panel and Admin Panel
-- Run this after the customer panel schema (complete-setup.sql)
-- ============================================================================

-- ============================================================================
-- VENDOR PANEL TABLES
-- ============================================================================

-- Table: vendors
-- Main vendor business profile
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users UNIQUE NOT NULL,
  
  -- Business Information
  business_name text NOT NULL,
  business_logo text,
  cover_banner text,
  description text,
  address text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  country text DEFAULT 'United States',
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  website_url text,
  
  -- Social Media
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  twitter_url text,
  
  -- Verification Documents
  verification_status text DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'suspended')
  ),
  id_proof_url text,
  business_license_url text,
  gst_certificate_url text,
  gst_number text,
  verified_at timestamp,
  verified_by uuid REFERENCES auth.users,
  rejection_reason text,
  
  -- Business Statistics
  total_leads integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  completed_events integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  subscription_plan text DEFAULT 'basic' CHECK (
    subscription_plan IN ('basic', 'premium', 'enterprise')
  ),
  subscription_expires_at timestamp,
  
  -- Timestamps
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  last_login_at timestamp,
  
  -- Constraints
  CONSTRAINT valid_rating CHECK (average_rating >= 0 AND average_rating <= 5)
);

-- Indexes for vendors
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_city ON vendors(city);
CREATE INDEX IF NOT EXISTS idx_vendors_verification_status ON vendors(verification_status);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_average_rating ON vendors(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at DESC);

-- RLS Policies for vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own profile" ON vendors
  FOR SELECT USING (auth.uid() = user_id OR verification_status = 'verified');

CREATE POLICY "Vendors can update own profile" ON vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert own profile" ON vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Table: vendor_services
-- Services offered by vendors
CREATE TABLE IF NOT EXISTS vendor_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  service_category text NOT NULL CHECK (
    service_category IN (
      'event_planning', 'decoration', 'photography', 'videography',
      'mehendi', 'catering', 'cake', 'dj', 'music_band',
      'venue', 'rental', 'makeup', 'return_gifts'
    )
  ),
  is_primary boolean DEFAULT false,
  description text,
  starting_price decimal(10,2),
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  UNIQUE(vendor_id, service_category)
);

CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor_id ON vendor_services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_services_category ON vendor_services(service_category);

-- RLS for vendor_services
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON vendor_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors can manage own services" ON vendor_services
  FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

-- Table: vendor_packages
-- Service packages offered by vendors
CREATE TABLE IF NOT EXISTS vendor_packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_service_id uuid REFERENCES vendor_services(id) ON DELETE CASCADE NOT NULL,
  package_name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  max_guests integer,
  duration_hours integer,
  is_customizable boolean DEFAULT true,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_packages_service_id ON vendor_packages(vendor_service_id);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_price ON vendor_packages(price);

-- RLS for vendor_packages
ALTER TABLE vendor_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages" ON vendor_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors can manage own packages" ON vendor_packages
  FOR ALL USING (
    vendor_service_id IN (
      SELECT vs.id FROM vendor_services vs
      JOIN vendors v ON vs.vendor_id = v.id
      WHERE v.user_id = auth.uid()
    )
  );


-- Table: vendor_leads
-- Customer requests to vendors
CREATE TABLE IF NOT EXISTS vendor_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES auth.users NOT NULL,
  event_id uuid REFERENCES events(id),
  
  -- Lead Details
  event_type text NOT NULL,
  event_date timestamp NOT NULL,
  guest_count integer,
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  location text,
  service_requested text NOT NULL,
  special_requirements text,
  customer_message text,
  
  -- Lead Status
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'contacted', 'approved', 'rejected', 'completed', 'expired', 'customer_cancelled')
  ),
  contacted_at timestamp,
  responded_at timestamp,
  approved_at timestamp,
  rejected_at timestamp,
  rejection_reason text,
  vendor_response text,
  proposed_price decimal(10,2),
  
  -- Communication
  last_message_at timestamp,
  
  -- Tracking
  source text DEFAULT 'search',
  conversion_probability decimal(3,2),
  
  created_at timestamp DEFAULT now(),
  expires_at timestamp DEFAULT (now() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_vendor_leads_vendor_id ON vendor_leads(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_customer_id ON vendor_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_status ON vendor_leads(status);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_event_date ON vendor_leads(event_date);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_created_at ON vendor_leads(created_at DESC);

-- RLS for vendor_leads
ALTER TABLE vendor_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own leads" ON vendor_leads
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Customers can create leads" ON vendor_leads
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can view own leads" ON vendor_leads
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can update own leads" ON vendor_leads
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );


-- Table: vendor_bookings
-- Confirmed bookings between customers and vendors
CREATE TABLE IF NOT EXISTS vendor_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) NOT NULL,
  customer_id uuid REFERENCES auth.users NOT NULL,
  lead_id uuid REFERENCES vendor_leads(id),
  event_id uuid REFERENCES events(id),
  package_id uuid REFERENCES vendor_packages(id),
  
  -- Booking Details
  service_type text NOT NULL,
  event_date timestamp NOT NULL,
  event_end_date timestamp,
  guest_count integer,
  venue_address text,
  
  -- Financial
  total_amount decimal(10,2) NOT NULL,
  advance_amount decimal(10,2),
  advance_paid boolean DEFAULT false,
  advance_paid_at timestamp,
  balance_amount decimal(10,2),
  balance_paid boolean DEFAULT false,
  balance_paid_at timestamp,
  
  -- Contract
  contract_url text,
  contract_signed_by_vendor boolean DEFAULT false,
  contract_signed_by_customer boolean DEFAULT false,
  contract_signed_at timestamp,
  terms_accepted boolean DEFAULT false,
  
  -- Status
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
  ),
  confirmed_at timestamp,
  cancelled_at timestamp,
  cancellation_reason text,
  completed_at timestamp,
  
  -- Tracking
  notes text,
  custom_requirements jsonb,
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_bookings_vendor_id ON vendor_bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_customer_id ON vendor_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_event_date ON vendor_bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_status ON vendor_bookings(status);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_created_at ON vendor_bookings(created_at DESC);

-- RLS for vendor_bookings
ALTER TABLE vendor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own bookings" ON vendor_bookings
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Customers can view own bookings" ON vendor_bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create bookings" ON vendor_bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can update own bookings" ON vendor_bookings
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Customers can update own bookings" ON vendor_bookings
  FOR UPDATE USING (auth.uid() = customer_id);


-- Table: vendor_reviews
-- Customer reviews for vendors
CREATE TABLE IF NOT EXISTS vendor_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) NOT NULL,
  customer_id uuid REFERENCES auth.users NOT NULL,
  booking_id uuid REFERENCES vendor_bookings(id),
  
  -- Review Content
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  review_text text NOT NULL,
  pros text,
  cons text,
  
  -- Detailed Ratings
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  value_rating integer CHECK (value_rating >= 1 AND value_rating <= 5),
  professionalism_rating integer CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  
  -- Media
  images text[],
  
  -- Vendor Response
  vendor_response text,
  vendor_responded_at timestamp,
  
  -- Status
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  is_spam boolean DEFAULT false,
  
  -- Engagement
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor_id ON vendor_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_customer_id ON vendor_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_rating ON vendor_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_created_at ON vendor_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_is_approved ON vendor_reviews(is_approved);

-- RLS for vendor_reviews
ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON vendor_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Customers can create reviews" ON vendor_reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can respond to reviews" ON vendor_reviews
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );


-- Table: vendor_portfolio
-- Vendor's work portfolio (images/videos)
CREATE TABLE IF NOT EXISTS vendor_portfolio (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Media Details
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL,
  thumbnail_url text,
  title text,
  description text,
  
  -- Categorization
  event_category text NOT NULL CHECK (
    event_category IN (
      'wedding', 'birthday', 'engagement', 'baby_shower',
      'housewarming', 'corporate', 'college', 'festival',
      'retirement', 'anniversary', 'other'
    )
  ),
  service_category text,
  tags text[],
  
  -- Analytics
  view_count integer DEFAULT 0,
  save_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  
  -- Status
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  display_order integer DEFAULT 0,
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_vendor_id ON vendor_portfolio(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_event_category ON vendor_portfolio(event_category);
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_view_count ON vendor_portfolio(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_is_approved ON vendor_portfolio(is_approved);

-- RLS for vendor_portfolio
ALTER TABLE vendor_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved portfolio" ON vendor_portfolio
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Vendors can manage own portfolio" ON vendor_portfolio
  FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

-- Table: vendor_notifications
-- Notifications for vendors
CREATE TABLE IF NOT EXISTS vendor_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Details
  type text NOT NULL CHECK (
    type IN (
      'new_lead', 'lead_response', 'booking_confirmed', 'booking_cancelled',
      'new_review', 'payment_received', 'verification_approved',
      'verification_rejected', 'profile_incomplete', 'subscription_expiring'
    )
  ),
  title text NOT NULL,
  message text NOT NULL,
  
  -- Related Entities
  related_lead_id uuid REFERENCES vendor_leads(id),
  related_booking_id uuid REFERENCES vendor_bookings(id),
  related_review_id uuid REFERENCES vendor_reviews(id),
  
  -- Action
  action_url text,
  action_label text,
  
  -- Status
  is_read boolean DEFAULT false,
  read_at timestamp,
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_notifications_vendor_id ON vendor_notifications(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_notifications_is_read ON vendor_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_vendor_notifications_created_at ON vendor_notifications(created_at DESC);

-- RLS for vendor_notifications
ALTER TABLE vendor_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own notifications" ON vendor_notifications
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Vendors can update own notifications" ON vendor_notifications
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );


-- Table: vendor_payments
-- Payment tracking for vendors
CREATE TABLE IF NOT EXISTS vendor_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) NOT NULL,
  booking_id uuid REFERENCES vendor_bookings(id),
  
  -- Payment Details
  amount decimal(10,2) NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('advance', 'balance', 'full')),
  payment_method text,
  
  -- Transaction
  transaction_id text UNIQUE,
  payment_gateway text,
  gateway_response jsonb,
  
  -- Status
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'refunded')
  ),
  processed_at timestamp,
  failed_reason text,
  refund_amount decimal(10,2),
  refunded_at timestamp,
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_payments_vendor_id ON vendor_payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payments_booking_id ON vendor_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payments_status ON vendor_payments(status);
CREATE INDEX IF NOT EXISTS idx_vendor_payments_created_at ON vendor_payments(created_at DESC);

-- RLS for vendor_payments
ALTER TABLE vendor_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own payments" ON vendor_payments
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

-- Table: vendor_availability
-- Vendor availability calendar
CREATE TABLE IF NOT EXISTS vendor_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Date Range
  date date NOT NULL,
  is_available boolean DEFAULT true,
  
  -- Slot Details
  time_slot_start time,
  time_slot_end time,
  
  -- Reason
  unavailability_reason text,
  
  created_at timestamp DEFAULT now(),
  
  UNIQUE(vendor_id, date, time_slot_start)
);

CREATE INDEX IF NOT EXISTS idx_vendor_availability_vendor_id ON vendor_availability(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_availability_date ON vendor_availability(date);

-- RLS for vendor_availability
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vendor availability" ON vendor_availability
  FOR SELECT USING (is_available = true OR is_available = false);

CREATE POLICY "Vendors can manage own availability" ON vendor_availability
  FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );


-- Table: vendor_analytics
-- Daily analytics for vendors
CREATE TABLE IF NOT EXISTS vendor_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Date
  date date NOT NULL,
  
  -- Metrics
  profile_views integer DEFAULT 0,
  portfolio_views integer DEFAULT 0,
  leads_received integer DEFAULT 0,
  leads_accepted integer DEFAULT 0,
  leads_rejected integer DEFAULT 0,
  bookings_confirmed integer DEFAULT 0,
  bookings_completed integer DEFAULT 0,
  revenue_earned decimal(10,2) DEFAULT 0,
  
  -- Engagement
  avg_response_time_hours decimal(5,2),
  conversion_rate decimal(5,2),
  
  created_at timestamp DEFAULT now(),
  
  UNIQUE(vendor_id, date)
);

CREATE INDEX IF NOT EXISTS idx_vendor_analytics_vendor_id ON vendor_analytics(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_date ON vendor_analytics(date DESC);

-- RLS for vendor_analytics
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own analytics" ON vendor_analytics
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

-- ============================================================================
-- ADMIN PANEL TABLES
-- ============================================================================

-- Table: admin_users
-- Admin user accounts with roles
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')),
  permissions jsonb DEFAULT '{}'::jsonb,
  
  -- Profile
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  
  -- Status
  is_active boolean DEFAULT true,
  last_login_at timestamp,
  created_by uuid REFERENCES admin_users(id),
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (
    user_id IN (SELECT user_id FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    user_id IN (
      SELECT user_id FROM admin_users 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );


-- Table: admin_activity_logs
-- Audit trail for admin actions
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES admin_users(id) NOT NULL,
  
  -- Action Details
  action_type text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  
  -- Details
  description text NOT NULL,
  changes jsonb,
  ip_address inet,
  user_agent text,
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON admin_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_activity_logs(target_type, target_id);

-- RLS for admin_activity_logs
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs" ON admin_activity_logs
  FOR SELECT USING (
    admin_id IN (SELECT id FROM admin_users WHERE user_id = auth.uid())
  );

-- Table: platform_stats
-- Daily platform statistics
CREATE TABLE IF NOT EXISTS platform_stats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date UNIQUE NOT NULL,
  
  -- User Metrics
  total_users integer DEFAULT 0,
  new_users_today integer DEFAULT 0,
  active_users_today integer DEFAULT 0,
  
  -- Vendor Metrics
  total_vendors integer DEFAULT 0,
  new_vendors_today integer DEFAULT 0,
  verified_vendors integer DEFAULT 0,
  pending_verifications integer DEFAULT 0,
  
  -- Event Metrics
  total_events integer DEFAULT 0,
  events_created_today integer DEFAULT 0,
  active_events integer DEFAULT 0,
  
  -- Booking Metrics
  total_bookings integer DEFAULT 0,
  bookings_today integer DEFAULT 0,
  completed_bookings integer DEFAULT 0,
  
  -- Financial Metrics
  total_revenue decimal(12,2) DEFAULT 0,
  revenue_today decimal(12,2) DEFAULT 0,
  platform_commission decimal(12,2) DEFAULT 0,
  
  -- Engagement Metrics
  avg_session_duration_minutes decimal(8,2),
  bounce_rate decimal(5,2),
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_stats_date ON platform_stats(date DESC);

-- RLS for platform_stats
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view platform stats" ON platform_stats
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );


-- Table: support_tickets
-- Customer and vendor support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number text UNIQUE NOT NULL,
  
  -- Requester
  user_id uuid REFERENCES auth.users,
  user_type text NOT NULL CHECK (user_type IN ('customer', 'vendor')),
  
  -- Contact
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  
  -- Ticket Details
  category text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  subject text NOT NULL,
  description text NOT NULL,
  attachments text[],
  
  -- Assignment
  assigned_to uuid REFERENCES admin_users(id),
  assigned_at timestamp,
  
  -- Status
  status text DEFAULT 'open' CHECK (
    status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')
  ),
  
  -- Related Entities
  related_booking_id uuid REFERENCES vendor_bookings(id),
  related_vendor_id uuid REFERENCES vendors(id),
  
  -- Resolution
  resolution_notes text,
  resolved_by uuid REFERENCES admin_users(id),
  resolved_at timestamp,
  
  -- Satisfaction
  satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  satisfaction_feedback text,
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- RLS for support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admins can update tickets" ON support_tickets
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- Table: support_ticket_messages
-- Messages within support tickets
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  
  -- Sender
  sender_id uuid REFERENCES auth.users,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'vendor', 'admin', 'system')),
  
  -- Message
  message text NOT NULL,
  attachments text[],
  is_internal boolean DEFAULT false,
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON support_ticket_messages(created_at);

-- RLS for support_ticket_messages
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ticket participants can view messages" ON support_ticket_messages
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM support_tickets WHERE user_id = auth.uid()
    ) OR
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Users can send messages" ON support_ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id OR
    auth.uid() IN (SELECT user_id FROM admin_users)
  );


-- Table: platform_templates
-- System templates for invitations, budgets, etc.
CREATE TABLE IF NOT EXISTS platform_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Template Info
  template_name text NOT NULL,
  template_type text NOT NULL CHECK (
    template_type IN (
      'invitation_card', 'video', 'voice', 'budget',
      'checklist', 'timeline', 'decoration', 'ai_prompt'
    )
  ),
  category text NOT NULL,
  
  -- Content
  template_data jsonb NOT NULL,
  preview_url text,
  thumbnail_url text,
  
  -- Metadata
  description text,
  tags text[],
  event_types text[],
  
  -- Settings
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  display_order integer DEFAULT 0,
  
  -- Usage Stats
  usage_count integer DEFAULT 0,
  
  -- Management
  created_by uuid REFERENCES admin_users(id),
  updated_by uuid REFERENCES admin_users(id),
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_type ON platform_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_category ON platform_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON platform_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_usage_count ON platform_templates(usage_count DESC);

-- RLS for platform_templates
ALTER TABLE platform_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates" ON platform_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON platform_templates
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- Table: content_reports
-- User-reported content for moderation
CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reporter
  reporter_id uuid REFERENCES auth.users NOT NULL,
  reporter_type text NOT NULL CHECK (reporter_type IN ('customer', 'vendor')),
  
  -- Reported Content
  content_type text NOT NULL CHECK (
    content_type IN ('review', 'portfolio', 'vendor_profile', 'user_profile')
  ),
  content_id uuid NOT NULL,
  
  -- Report Details
  reason text NOT NULL,
  description text NOT NULL,
  evidence_urls text[],
  
  -- Moderation
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'under_review', 'action_taken', 'dismissed')
  ),
  reviewed_by uuid REFERENCES admin_users(id),
  reviewed_at timestamp,
  admin_notes text,
  action_taken text,
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_content ON content_reports(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_created_at ON content_reports(created_at DESC);

-- RLS for content_reports
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON content_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON content_reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON content_reports
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admins can update reports" ON content_reports
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );


-- Table: platform_settings
-- System-wide configuration settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  setting_type text NOT NULL CHECK (
    setting_type IN ('general', 'email', 'payment', 'ai', 'security', 'notification')
  ),
  description text,
  is_public boolean DEFAULT false,
  
  updated_by uuid REFERENCES admin_users(id),
  updated_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON platform_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_platform_settings_type ON platform_settings(setting_type);

-- RLS for platform_settings
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings viewable by all" ON platform_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage settings" ON platform_settings
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM admin_users WHERE role IN ('super_admin', 'admin'))
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update vendor average rating
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendors
  SET 
    average_rating = (
      SELECT AVG(rating)::decimal(3,2)
      FROM vendor_reviews
      WHERE vendor_id = NEW.vendor_id AND is_approved = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM vendor_reviews
      WHERE vendor_id = NEW.vendor_id AND is_approved = true
    ),
    updated_at = now()
  WHERE id = NEW.vendor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for review rating update
DROP TRIGGER IF EXISTS trigger_update_vendor_rating ON vendor_reviews;
CREATE TRIGGER trigger_update_vendor_rating
AFTER INSERT OR UPDATE OR DELETE ON vendor_reviews
FOR EACH ROW
EXECUTE FUNCTION update_vendor_rating();

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'EVTS-' || LPAD(nextval('ticket_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1000;

-- Trigger for ticket number generation
DROP TRIGGER IF EXISTS trigger_generate_ticket_number ON support_tickets;
CREATE TRIGGER trigger_generate_ticket_number
BEFORE INSERT ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION generate_ticket_number();

-- Function to auto-expire leads
CREATE OR REPLACE FUNCTION auto_expire_leads()
RETURNS void AS $$
BEGIN
  UPDATE vendor_leads
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to update vendor stats on lead action
CREATE OR REPLACE FUNCTION update_vendor_lead_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'contacted' AND OLD.status = 'pending' THEN
    UPDATE vendors
    SET total_leads = total_leads + 1
    WHERE id = NEW.vendor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vendor lead stats
DROP TRIGGER IF EXISTS trigger_update_vendor_lead_stats ON vendor_leads;
CREATE TRIGGER trigger_update_vendor_lead_stats
AFTER UPDATE ON vendor_leads
FOR EACH ROW
EXECUTE FUNCTION update_vendor_lead_stats();

-- Function to update vendor booking stats
CREATE OR REPLACE FUNCTION update_vendor_booking_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE vendors
    SET total_bookings = total_bookings + 1
    WHERE id = NEW.vendor_id;
  ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE vendors
    SET completed_events = completed_events + 1
    WHERE id = NEW.vendor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vendor booking stats
DROP TRIGGER IF EXISTS trigger_update_vendor_booking_stats ON vendor_bookings;
CREATE TRIGGER trigger_update_vendor_booking_stats
AFTER INSERT OR UPDATE ON vendor_bookings
FOR EACH ROW
EXECUTE FUNCTION update_vendor_booking_stats();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description, is_public)
VALUES
  ('platform_name', '"EventVerse"', 'general', 'Platform name', true),
  ('platform_tagline', '"AI-Powered Event Planning Platform"', 'general', 'Platform tagline', true),
  ('support_email', '"support@eventverse.com"', 'general', 'Support email', true),
  ('commission_rate', '0.15', 'payment', 'Platform commission rate (15%)', false),
  ('ai_enabled', 'true', 'ai', 'Enable AI features', false),
  ('maintenance_mode', 'false', 'general', 'Platform in maintenance mode', false)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Vendor & Admin Panel Schema created successfully!';
  RAISE NOTICE 'Tables created: 18';
  RAISE NOTICE 'Indexes created: 50+';
  RAISE NOTICE 'RLS policies enabled on all tables';
END $$;
