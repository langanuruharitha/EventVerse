-- ============================================
-- VENDOR LEAD MANAGEMENT SYSTEM
-- ============================================
-- Version: 1.0
-- Created: 2026-07-02
-- Description: Complete lead management system for customer-vendor communication
--              When customer selects vendor, system creates lead and sends email

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VENDORS TABLE (Business/Service Provider)
-- ============================================

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Business Information
  business_name VARCHAR(255) NOT NULL,
  business_logo_url TEXT,
  cover_banner_url TEXT,
  description TEXT,
  tagline VARCHAR(500),
  
  -- Contact Information
  business_email VARCHAR(255) NOT NULL,
  business_phone VARCHAR(20),
  website_url TEXT,
  social_media JSONB,
  -- {"facebook": "url", "instagram": "url", "linkedin": "url"}
  
  -- Location
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  country VARCHAR(100) DEFAULT 'India',
  service_areas TEXT[],
  -- ["Mumbai", "Navi Mumbai", "Thane"]
  
  -- Services Offered
  primary_category VARCHAR(100) NOT NULL,
  -- decoration, photography, catering, etc.
  services_offered TEXT[] NOT NULL,
  event_types_served TEXT[],
  -- ["wedding", "birthday", "corporate"]
  
  -- Pricing
  min_price DECIMAL(12,2),
  max_price DECIMAL(12,2),
  price_range VARCHAR(50),
  -- "₹10,000 - ₹50,000"
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Verification & Status
  verification_status VARCHAR(50) DEFAULT 'pending',
  -- pending, verified, rejected, suspended
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  
  -- Business Documents
  business_license_url TEXT,
  gst_number VARCHAR(50),
  pan_number VARCHAR(20),
  id_proof_url TEXT,
  
  -- Ratings & Reviews
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  total_bookings INT DEFAULT 0,
  completed_bookings INT DEFAULT 0,
  
  -- Portfolio
  portfolio_images TEXT[],
  portfolio_videos TEXT[],
  portfolio_description TEXT,
  
  -- Availability
  is_active BOOLEAN DEFAULT TRUE,
  accepting_leads BOOLEAN DEFAULT TRUE,
  response_time_hours INT DEFAULT 24,
  
  -- Subscription/Plan
  subscription_plan VARCHAR(50) DEFAULT 'free',
  -- free, basic, premium, enterprise
  subscription_expires_at TIMESTAMP,
  
  -- Stats
  profile_views INT DEFAULT 0,
  lead_count INT DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP
);

-- ============================================
-- VENDOR LEADS TABLE (Customer Inquiries)
-- ============================================

CREATE TABLE IF NOT EXISTS vendor_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Lead Source
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(255),
  event_date DATE,
  event_location VARCHAR(255),
  event_venue VARCHAR(255),
  guest_count INT,
  
  -- Service Required
  service_category VARCHAR(100) NOT NULL,
  -- decoration, photography, catering, etc.
  service_details TEXT,
  specific_requirements TEXT,
  
  -- Budget
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  budget_flexible BOOLEAN DEFAULT TRUE,
  
  -- Customer Contact (from event owner)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  
  -- Lead Status Workflow
  lead_status VARCHAR(50) DEFAULT 'new',
  -- new, contacted, quoted, negotiating, accepted, rejected, expired, converted
  
  -- Vendor Actions
  vendor_viewed_at TIMESTAMP,
  vendor_responded_at TIMESTAMP,
  vendor_response_message TEXT,
  
  -- Quote Details
  quoted_price DECIMAL(12,2),
  quote_details TEXT,
  quote_validity_days INT DEFAULT 7,
  quote_sent_at TIMESTAMP,
  
  -- Communication
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  email_opened BOOLEAN DEFAULT FALSE,
  email_opened_at TIMESTAMP,
  
  -- Customer Response
  customer_viewed_response BOOLEAN DEFAULT FALSE,
  customer_response_status VARCHAR(50),
  -- interested, not_interested, need_more_info, accepted, declined
  customer_feedback TEXT,
  
  -- Lead Priority
  priority VARCHAR(20) DEFAULT 'medium',
  -- low, medium, high, urgent
  is_hot_lead BOOLEAN DEFAULT FALSE,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  follow_up_notes TEXT,
  last_follow_up_at TIMESTAMP,
  
  -- Conversion
  converted_to_booking BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP,
  booking_id UUID,
  booking_amount DECIMAL(12,2),
  
  -- Lead Source Tracking
  source VARCHAR(50) DEFAULT 'direct',
  -- direct, search, recommendation, advertisement
  referrer_url TEXT,
  
  -- Expiry
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  is_expired BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_budget CHECK (budget_min <= budget_max)
);

-- ============================================
-- LEAD ACTIONS/TIMELINE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS vendor_lead_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES vendor_leads(id) ON DELETE CASCADE NOT NULL,
  
  -- Action Details
  action_type VARCHAR(100) NOT NULL,
  -- created, viewed, contacted, quoted, accepted, rejected, 
  -- customer_responded, follow_up, converted, expired
  
  action_by UUID REFERENCES users(id),
  action_by_role VARCHAR(50),
  -- customer, vendor, system
  
  -- Action Data
  action_message TEXT,
  action_data JSONB,
  -- Store additional context like quote details, rejection reason, etc.
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- VENDOR NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS vendor_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Details
  notification_type VARCHAR(100) NOT NULL,
  -- new_lead, lead_response, booking_confirmed, review_received, payment_received, new_inquiry
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Related Entity
  related_entity_type VARCHAR(50),
  -- lead, booking, review, payment, inquiry
  related_entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Priority
  priority VARCHAR(20) DEFAULT 'medium',
  -- low, medium, high, urgent
  
  -- Action URL
  action_url TEXT,
  action_label VARCHAR(100),
  
  -- Expiry
  expires_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- VENDOR INQUIRIES TABLE (Internal Messaging)
-- ============================================

CREATE TABLE IF NOT EXISTS vendor_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Customer Info (denormalized for quick access)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  
  -- Inquiry Details
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  event_type VARCHAR(100),
  
  -- Status
  status VARCHAR(50) DEFAULT 'new',
  -- new, read, replied, resolved, closed
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Vendor Response
  vendor_response TEXT,
  responded_at TIMESTAMP,
  
  -- Priority
  priority VARCHAR(20) DEFAULT 'medium',
  
  -- Conversation Thread
  thread_messages JSONB DEFAULT '[]'::jsonb,
  -- Store conversation history: [{"from": "customer", "message": "...", "timestamp": "..."}]
  
  -- Follow-up
  requires_follow_up BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EMAIL TEMPLATES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Template Details
  template_name VARCHAR(255) NOT NULL UNIQUE,
  template_type VARCHAR(100) NOT NULL,
  -- vendor_new_lead, customer_quote_received, booking_confirmation, etc.
  
  subject_line VARCHAR(500) NOT NULL,
  email_body TEXT NOT NULL,
  -- Supports placeholders like {{customer_name}}, {{event_type}}, etc.
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Usage Stats
  times_sent INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EMAIL LOG TABLE (Track all emails sent)
-- ============================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Email Details
  template_id UUID REFERENCES email_templates(id),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  
  -- Related Entity
  related_entity_type VARCHAR(50),
  -- lead, booking, notification
  related_entity_id UUID,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, sent, delivered, opened, clicked, failed, bounced
  
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  failed_at TIMESTAMP,
  
  -- Error Info
  error_message TEXT,
  retry_count INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Vendors Indexes
CREATE INDEX IF NOT EXISTS idx_vendors_user ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(primary_category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_vendors_verified ON vendors(is_verified) WHERE is_verified = TRUE AND is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_vendors_city_state ON vendors(city, state) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(average_rating DESC) WHERE is_active = TRUE;

-- Leads Indexes
CREATE INDEX IF NOT EXISTS idx_leads_vendor ON vendor_leads(vendor_id, lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_customer ON vendor_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_event ON vendor_leads(event_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON vendor_leads(lead_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_hot ON vendor_leads(is_hot_lead) WHERE is_hot_lead = TRUE;
CREATE INDEX IF NOT EXISTS idx_leads_expiry ON vendor_leads(expires_at) WHERE is_expired = FALSE;
CREATE INDEX IF NOT EXISTS idx_leads_converted ON vendor_leads(converted_to_booking) WHERE converted_to_booking = TRUE;

-- Lead Actions Index
CREATE INDEX IF NOT EXISTS idx_lead_actions_lead ON vendor_lead_actions(lead_id, created_at DESC);

-- Notifications Index
CREATE INDEX IF NOT EXISTS idx_notifications_vendor ON vendor_notifications(vendor_id, is_read, created_at DESC);

-- Inquiries Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_vendor ON vendor_inquiries(vendor_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_customer ON vendor_inquiries(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_unread ON vendor_inquiries(vendor_id, is_read) WHERE is_read = FALSE;

-- Email Logs Index
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_related ON email_logs(related_entity_type, related_entity_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_lead_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Vendors Policies
-- Public can view active verified vendors
CREATE POLICY "Vendors readable by all" ON vendors
  FOR SELECT USING (is_active = TRUE AND is_verified = TRUE);

-- Vendor owners can manage their profile
CREATE POLICY "Vendors manageable by owner" ON vendors
  FOR ALL USING (auth.uid() = user_id);

-- Admins can manage all vendors
CREATE POLICY "Vendors manageable by admin" ON vendors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Vendor Leads Policies
-- Vendors can view their own leads
CREATE POLICY "Leads readable by vendor" ON vendor_leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
  );

-- Customers can view their own leads
CREATE POLICY "Leads readable by customer" ON vendor_leads
  FOR SELECT USING (customer_id = auth.uid());

-- Customers can create leads
CREATE POLICY "Leads insertable by customer" ON vendor_leads
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Vendors can update their leads
CREATE POLICY "Leads updatable by vendor" ON vendor_leads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
  );

-- Customers can update leads they created
CREATE POLICY "Leads updatable by customer" ON vendor_leads
  FOR UPDATE USING (customer_id = auth.uid());

-- Lead Actions Policies
-- Can view actions for leads they have access to
CREATE POLICY "Lead actions readable by related parties" ON vendor_lead_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendor_leads vl
      WHERE vl.id = lead_id
        AND (
          vl.customer_id = auth.uid() 
          OR EXISTS (SELECT 1 FROM vendors WHERE id = vl.vendor_id AND user_id = auth.uid())
        )
    )
  );

-- Can insert actions for leads they have access to
CREATE POLICY "Lead actions insertable by related parties" ON vendor_lead_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendor_leads vl
      WHERE vl.id = lead_id
        AND (
          vl.customer_id = auth.uid() 
          OR EXISTS (SELECT 1 FROM vendors WHERE id = vl.vendor_id AND user_id = auth.uid())
        )
    )
  );

-- Vendor Notifications Policies
-- Vendors can only see their own notifications
CREATE POLICY "Notifications accessible by vendor" ON vendor_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
  );

-- Inquiries Policies
-- Customers can view their inquiries
CREATE POLICY "Inquiries readable by customer" ON vendor_inquiries
  FOR SELECT USING (customer_id = auth.uid());

-- Customers can create inquiries
CREATE POLICY "Inquiries insertable by customer" ON vendor_inquiries
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Email Templates Policies
-- Everyone can read active templates
CREATE POLICY "Email templates readable by all" ON email_templates
  FOR SELECT USING (is_active = TRUE);

-- Only admins can manage templates
CREATE POLICY "Email templates manageable by admin" ON email_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Email Logs Policies
-- Users can see emails sent to them or by them
CREATE POLICY "Email logs readable by related parties" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
        AND (email = recipient_email OR role = 'admin')
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update lead status when expired
CREATE OR REPLACE FUNCTION update_expired_leads()
RETURNS void AS $$
BEGIN
  UPDATE vendor_leads
  SET 
    is_expired = TRUE,
    lead_status = 'expired',
    updated_at = NOW()
  WHERE expires_at < NOW() 
    AND is_expired = FALSE
    AND lead_status NOT IN ('converted', 'accepted', 'rejected');
END;
$$ LANGUAGE plpgsql;

-- Function to update vendor stats
CREATE OR REPLACE FUNCTION update_vendor_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update lead count
  UPDATE vendors
  SET 
    lead_count = (
      SELECT COUNT(*) FROM vendor_leads WHERE vendor_id = NEW.vendor_id
    ),
    conversion_rate = (
      SELECT 
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE (COUNT(*) FILTER (WHERE converted_to_booking = TRUE) * 100.0 / COUNT(*))
        END
      FROM vendor_leads 
      WHERE vendor_id = NEW.vendor_id
    ),
    updated_at = NOW()
  WHERE id = NEW.vendor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update vendor stats
CREATE TRIGGER trigger_update_vendor_stats
AFTER INSERT OR UPDATE ON vendor_leads
FOR EACH ROW
EXECUTE FUNCTION update_vendor_stats();

-- Function to create lead action timeline entry
CREATE OR REPLACE FUNCTION create_lead_action()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- New lead created
    INSERT INTO vendor_lead_actions (lead_id, action_type, action_by, action_by_role, action_message)
    VALUES (NEW.id, 'created', NEW.customer_id, 'customer', 'New lead created by customer');
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Status changed
    IF OLD.lead_status != NEW.lead_status THEN
      INSERT INTO vendor_lead_actions (lead_id, action_type, action_by, action_by_role, action_message)
      VALUES (
        NEW.id, 
        'status_changed', 
        auth.uid(), 
        CASE WHEN NEW.vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()) THEN 'vendor' ELSE 'customer' END,
        'Lead status changed from ' || OLD.lead_status || ' to ' || NEW.lead_status
      );
    END IF;
    
    -- Quote sent
    IF OLD.quoted_price IS NULL AND NEW.quoted_price IS NOT NULL THEN
      INSERT INTO vendor_lead_actions (lead_id, action_type, action_by, action_by_role, action_message)
      VALUES (NEW.id, 'quoted', auth.uid(), 'vendor', 'Vendor sent quote: ₹' || NEW.quoted_price);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create lead actions
CREATE TRIGGER trigger_create_lead_action
AFTER INSERT OR UPDATE ON vendor_leads
FOR EACH ROW
EXECUTE FUNCTION create_lead_action();

-- ============================================
-- INSERT DEFAULT EMAIL TEMPLATES
-- ============================================

INSERT INTO email_templates (template_name, template_type, subject_line, email_body, is_active) VALUES
(
  'vendor_new_lead_notification',
  'vendor_new_lead',
  '🎯 New Lead Alert: {{customer_name}} is interested in your {{service_category}} services!',
  'Dear {{vendor_business_name}},

Great news! You have received a new lead from EventVerse.

📋 LEAD DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Customer Name: {{customer_name}}
• Email: {{customer_email}}
• Phone: {{customer_phone}}
• Event Type: {{event_type}}
• Event Name: {{event_name}}
• Event Date: {{event_date}}
• Event Location: {{event_location}}
• Guest Count: {{guest_count}} guests

💰 BUDGET:
• Budget Range: ₹{{budget_min}} - ₹{{budget_max}}

📝 SERVICE REQUIRED:
• Category: {{service_category}}
• Details: {{service_details}}

📌 SPECIFIC REQUIREMENTS:
{{specific_requirements}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ NEXT STEPS:
1. Log in to your Vendor Portal: {{vendor_portal_url}}
2. Review the complete lead details
3. Send your quote and response
4. Connect with the customer

⏰ RESPOND QUICKLY:
Leads that receive a response within 24 hours have 3x higher conversion rates!

💡 TIP: Personalize your response and highlight what makes your services unique.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Need help? Contact our support team.

Best regards,
EventVerse Team

📧 support@eventverse.com
🌐 www.eventverse.com',
  TRUE
),
(
  'customer_lead_confirmation',
  'customer_lead_created',
  '✅ We''ve contacted {{vendor_business_name}} on your behalf!',
  'Hi {{customer_name}},

Great! We''ve successfully sent your inquiry to {{vendor_business_name}}.

📋 YOUR REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Service: {{service_category}}
• Event: {{event_name}}
• Date: {{event_date}}
• Budget: ₹{{budget_min}} - ₹{{budget_max}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ WHAT''S NEXT:
1. The vendor will review your requirements
2. You''ll receive a response typically within 24-48 hours
3. You can view the vendor''s response in your EventVerse dashboard

📊 TRACK YOUR LEAD:
View lead status and vendor response here: {{lead_status_url}}

💡 WHILE YOU WAIT:
• Explore more vendors in the {{service_category}} category
• Check out our AI-powered event planning tools
• Review our event planning guides and checklists

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? We''re here to help!

Happy Planning! 🎉
EventVerse Team

📧 support@eventverse.com
🌐 www.eventverse.com',
  TRUE
);

-- ============================================
-- SAMPLE VENDORS DATA (For Testing)
-- ============================================

-- Note: Run this AFTER users table has some data
-- INSERT INTO vendors (user_id, business_name, business_email, business_phone, description, primary_category, services_offered, city, state, min_price, max_price, price_range, is_verified, is_active)
-- SELECT 
--   id,
--   'Elite Decorators',
--   'contact@elitedecorators.com',
--   '+919876543210',
--   'Premium decoration services for all types of events. Specializing in wedding and corporate event decoration with a team of experienced designers.',
--   'decoration',
--   ARRAY['Stage Decoration', 'Floral Arrangements', 'Lighting Setup', 'Theme Decoration', 'Backdrop Design'],
--   'Mumbai',
--   'Maharashtra',
--   25000,
--   500000,
--   '₹25,000 - ₹5,00,000',
--   TRUE,
--   TRUE
-- FROM users WHERE email = 'vendor1@example.com' LIMIT 1;

-- ============================================
-- VENDOR LEAD SYSTEM COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Create API endpoints for lead creation
-- 3. Implement email sending functionality (using Resend/SendGrid)
-- 4. Build vendor portal UI
-- 5. Create customer lead tracking dashboard
