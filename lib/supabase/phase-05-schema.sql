-- ============================================
-- PHASE 05: BUDGET TRACKING & GUEST MANAGEMENT
-- ============================================
-- Version: 1.0
-- Created: 2026-01-07
-- Description: Comprehensive budget tracking with expense management
--              and guest list management with advanced features

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 0: BASE TABLES (if not exist)
-- ============================================

-- Create budgets table (base table for budget tracking)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  total_budget DECIMAL(12,2) NOT NULL CHECK (total_budget > 0),
  spent_amount DECIMAL(12,2) DEFAULT 0.00,
  remaining_amount DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id)
);

-- Create budget_categories table (base table for category tracking)
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL CHECK (allocated_amount >= 0),
  allocated_percentage DECIMAL(5,2),
  spent_amount DECIMAL(12,2) DEFAULT 0.00,
  remaining_amount DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create expenses table (base table for expense tracking)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES budget_categories(id),
  expense_name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  expense_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create guests table (base table for guest management)
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  rsvp_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for base tables
CREATE INDEX IF NOT EXISTS idx_budgets_event ON budgets(event_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_budget ON budget_categories(budget_id);
CREATE INDEX IF NOT EXISTS idx_expenses_budget ON expenses(budget_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_guests_event ON guests(event_id);

-- ============================================
-- PART 1: BUDGET TRACKING ENHANCEMENT
-- ============================================

-- Extend existing budgets table
ALTER TABLE budgets 
  ADD COLUMN IF NOT EXISTS budget_template_id UUID,
  ADD COLUMN IF NOT EXISTS auto_categorization BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS alert_threshold_percentage INT DEFAULT 90,
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Budget Templates for different event types
CREATE TABLE IF NOT EXISTS budget_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  description TEXT,
  category_allocations JSONB NOT NULL,
  -- Example: {"venue": 25, "food": 35, "decoration": 15, ...}
  is_default BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default budget templates
INSERT INTO budget_templates (template_name, event_type, description, category_allocations, is_default) VALUES
('Standard Birthday Party', 'birthday', 'Typical budget allocation for birthday parties', 
 '{"venue": 20, "food": 35, "decoration": 15, "entertainment": 10, "photography": 10, "miscellaneous": 10}'::jsonb, true),
 
('Wedding Budget', 'wedding', 'Comprehensive wedding budget template',
 '{"venue": 25, "catering": 30, "decoration": 10, "photography": 8, "entertainment": 7, "attire": 10, "invitations": 3, "miscellaneous": 7}'::jsonb, true),
 
('Corporate Event', 'corporate', 'Professional corporate event budget',
 '{"venue": 30, "catering": 25, "av_equipment": 15, "branding": 10, "speakers": 10, "miscellaneous": 10}'::jsonb, true),
 
('Anniversary Celebration', 'anniversary', 'Anniversary party budget template',
 '{"venue": 25, "food": 30, "decoration": 15, "entertainment": 15, "photography": 10, "miscellaneous": 5}'::jsonb, true);

-- Enhanced expenses table
ALTER TABLE expenses 
  ADD COLUMN IF NOT EXISTS receipt_urls TEXT[],
  ADD COLUMN IF NOT EXISTS ocr_extracted_data JSONB,
  ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'auto_approved',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS recurring_expense_id UUID,
  ADD COLUMN IF NOT EXISTS split_between_events UUID[],
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS vendor_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Budget Alerts
CREATE TABLE IF NOT EXISTS budget_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES budget_categories(id),
  alert_type VARCHAR(50) NOT NULL,
  -- threshold_reached, overspent, payment_due, weekly_summary
  alert_message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium', 
  -- low, medium, high, critical
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP,
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recurring Expenses
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  expense_name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES budget_categories(id),
  amount DECIMAL(12,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL, 
  -- daily, weekly, monthly, quarterly
  start_date DATE NOT NULL,
  end_date DATE,
  next_due_date DATE,
  last_generated_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  auto_create BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Financial Reports
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id),
  report_type VARCHAR(50) NOT NULL,
  -- summary, detailed, category_wise, vendor_wise, timeline, forecast
  report_name VARCHAR(255),
  report_data JSONB NOT NULL,
  file_url TEXT, -- PDF/Excel file URL
  generated_at TIMESTAMP DEFAULT NOW(),
  generated_by UUID REFERENCES users(id),
  expires_at TIMESTAMP
);

-- Budget Optimization Recommendations
CREATE TABLE IF NOT EXISTS budget_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL,
  -- reduce_spending, reallocate, negotiate_vendor, alternative_option
  category_id UUID REFERENCES budget_categories(id),
  current_amount DECIMAL(12,2),
  suggested_amount DECIMAL(12,2),
  potential_savings DECIMAL(12,2),
  recommendation_text TEXT NOT NULL,
  ai_confidence DECIMAL(3,2), -- 0.00 to 1.00
  is_accepted BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PART 2: GUEST MANAGEMENT SYSTEM
-- ============================================

-- Enhanced guests table
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS guest_category VARCHAR(50) DEFAULT 'general',
  -- vip, family, friends, colleagues, vendors, general
  ADD COLUMN IF NOT EXISTS invitation_sent_date TIMESTAMP,
  ADD COLUMN IF NOT EXISTS invitation_method VARCHAR(50),
  -- email, whatsapp, sms, physical
  ADD COLUMN IF NOT EXISTS plus_one_allowed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS plus_one_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plus_one_names TEXT[],
  ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[],
  ADD COLUMN IF NOT EXISTS meal_preference VARCHAR(50),
  -- vegetarian, non_vegetarian, vegan, halal, kosher, other
  ADD COLUMN IF NOT EXISTS accommodation_needed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accommodation_details JSONB,
  ADD COLUMN IF NOT EXISTS transportation_needed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS transportation_details JSONB,
  ADD COLUMN IF NOT EXISTS special_requirements TEXT,
  ADD COLUMN IF NOT EXISTS gift_received JSONB,
  ADD COLUMN IF NOT EXISTS attendance_status VARCHAR(50) DEFAULT 'pending',
  -- confirmed, declined, tentative, no_show, attended
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS table_assignment VARCHAR(100),
  ADD COLUMN IF NOT EXISTS seat_number INT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Guest Groups
CREATE TABLE IF NOT EXISTS guest_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  group_name VARCHAR(100) NOT NULL,
  description TEXT,
  color_code VARCHAR(7) DEFAULT '#6366f1',
  group_type VARCHAR(50) DEFAULT 'custom',
  -- family, friends, colleagues, vip, vendors, custom
  guest_count INT DEFAULT 0,
  confirmed_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Link guests to groups (many-to-many)
CREATE TABLE IF NOT EXISTS guest_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  group_id UUID REFERENCES guest_groups(id) ON DELETE CASCADE,
  role_in_group VARCHAR(50),
  -- primary, spouse, child, parent, sibling, friend, colleague
  added_at TIMESTAMP DEFAULT NOW(),
  added_by UUID REFERENCES users(id),
  UNIQUE(guest_id, group_id)
);

-- Seating Arrangements
CREATE TABLE IF NOT EXISTS seating_arrangements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  arrangement_name VARCHAR(255) DEFAULT 'Main Seating',
  layout_type VARCHAR(50) DEFAULT 'round_tables',
  -- round_tables, long_tables, theater, classroom, cocktail, custom
  total_tables INT DEFAULT 0,
  total_seats INT DEFAULT 0,
  assigned_seats INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_locked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seating Tables
CREATE TABLE IF NOT EXISTS seating_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arrangement_id UUID REFERENCES seating_arrangements(id) ON DELETE CASCADE,
  table_number VARCHAR(20) NOT NULL,
  table_name VARCHAR(100),
  table_type VARCHAR(50) DEFAULT 'round',
  -- round, rectangle, square, oval, high_top
  seat_capacity INT NOT NULL,
  occupied_seats INT DEFAULT 0,
  table_position JSONB,
  -- {x: 100, y: 200, rotation: 0} for visual layout
  is_vip_table BOOLEAN DEFAULT FALSE,
  special_requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seating Assignments
CREATE TABLE IF NOT EXISTS seating_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  table_id UUID REFERENCES seating_tables(id) ON DELETE CASCADE,
  seat_number INT,
  seat_position JSONB,
  -- {x: 10, y: 20, angle: 0} relative to table center
  special_requests TEXT,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(table_id, seat_number)
);

-- Gift Tracking
CREATE TABLE IF NOT EXISTS gifts_received (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  gift_description TEXT NOT NULL,
  estimated_value DECIMAL(10,2),
  received_date DATE DEFAULT CURRENT_DATE,
  gift_category VARCHAR(100),
  -- money, jewelry, home_goods, experience, other
  thank_you_sent BOOLEAN DEFAULT FALSE,
  thank_you_sent_date DATE,
  thank_you_method VARCHAR(50),
  -- email, whatsapp, sms, call, physical_card
  gift_images TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guest Communication Log
CREATE TABLE IF NOT EXISTS guest_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  communication_type VARCHAR(50) NOT NULL,
  -- invitation, reminder, update, thank_you, survey
  channel VARCHAR(50) NOT NULL,
  -- email, whatsapp, sms, call
  subject VARCHAR(255),
  message_content TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent',
  -- sent, delivered, opened, clicked, failed, bounced
  error_message TEXT,
  sent_by UUID REFERENCES users(id)
);

-- Guest Check-in System
CREATE TABLE IF NOT EXISTS guest_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMP DEFAULT NOW(),
  checked_in_by UUID REFERENCES users(id),
  check_in_method VARCHAR(50) DEFAULT 'manual',
  -- manual, qr_code, facial_recognition, badge_scan
  plus_ones_count INT DEFAULT 0,
  plus_one_names TEXT[],
  notes TEXT,
  UNIQUE(event_id, guest_id)
);

-- ============================================
-- PART 3: INDEXES FOR PERFORMANCE
-- ============================================

-- Budget Indexes
CREATE INDEX IF NOT EXISTS idx_budget_templates_event_type ON budget_templates(event_type);
CREATE INDEX IF NOT EXISTS idx_budget_templates_default ON budget_templates(is_default) WHERE is_default = TRUE;
CREATE INDEX IF NOT EXISTS idx_budget_alerts_budget ON budget_alerts(budget_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_budget ON recurring_expenses(budget_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_financial_reports_event ON financial_reports(event_id);

-- Guest Indexes
CREATE INDEX IF NOT EXISTS idx_guests_event_category ON guests(event_id, guest_category);
CREATE INDEX IF NOT EXISTS idx_guests_attendance ON guests(event_id, attendance_status);
CREATE INDEX IF NOT EXISTS idx_guest_groups_event ON guest_groups(event_id);
CREATE INDEX IF NOT EXISTS idx_guest_group_members_guest ON guest_group_members(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_group_members_group ON guest_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_seating_arrangements_event ON seating_arrangements(event_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_seating_tables_arrangement ON seating_tables(arrangement_id);
CREATE INDEX IF NOT EXISTS idx_seating_assignments_guest ON seating_assignments(guest_id);
CREATE INDEX IF NOT EXISTS idx_seating_assignments_table ON seating_assignments(table_id);
CREATE INDEX IF NOT EXISTS idx_gifts_event_guest ON gifts_received(event_id, guest_id);
CREATE INDEX IF NOT EXISTS idx_communications_event_guest ON guest_communications(event_id, guest_id);
CREATE INDEX IF NOT EXISTS idx_checkins_event ON guest_checkins(event_id);

-- ============================================
-- PART 4: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE budget_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts_received ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_checkins ENABLE ROW LEVEL SECURITY;

-- Budget Templates - Everyone can read, only creators/admins can modify
CREATE POLICY "Budget templates readable by all" ON budget_templates
  FOR SELECT USING (true);

CREATE POLICY "Budget templates insertable by authenticated users" ON budget_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Budget templates updatable by creator or admin" ON budget_templates
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Budget Alerts - Only event owner can access
CREATE POLICY "Budget alerts accessible by event owner" ON budget_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM budgets b
      JOIN events e ON e.id = b.event_id
      WHERE b.id = budget_id AND e.user_id = auth.uid()
    )
  );

-- Recurring Expenses - Only event owner
CREATE POLICY "Recurring expenses accessible by event owner" ON recurring_expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM budgets b
      JOIN events e ON e.id = b.event_id
      WHERE b.id = budget_id AND e.user_id = auth.uid()
    )
  );

-- Financial Reports - Only event owner and admins
CREATE POLICY "Financial reports accessible by owner and admin" ON financial_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Guest Groups - Only event owner
CREATE POLICY "Guest groups accessible by event owner" ON guest_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Guest Group Members - Only event owner
CREATE POLICY "Guest group members accessible by event owner" ON guest_group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM guest_groups gg
      JOIN events e ON e.id = gg.event_id
      WHERE gg.id = group_id AND e.user_id = auth.uid()
    )
  );

-- Seating Arrangements - Only event owner
CREATE POLICY "Seating arrangements accessible by event owner" ON seating_arrangements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Seating Tables - Only event owner
CREATE POLICY "Seating tables accessible by event owner" ON seating_tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM seating_arrangements sa
      JOIN events e ON e.id = sa.event_id
      WHERE sa.id = arrangement_id AND e.user_id = auth.uid()
    )
  );

-- Seating Assignments - Only event owner
CREATE POLICY "Seating assignments accessible by event owner" ON seating_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM seating_tables st
      JOIN seating_arrangements sa ON sa.id = st.arrangement_id
      JOIN events e ON e.id = sa.event_id
      WHERE st.id = table_id AND e.user_id = auth.uid()
    )
  );

-- Gifts Received - Only event owner
CREATE POLICY "Gifts accessible by event owner" ON gifts_received
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Guest Communications - Only event owner
CREATE POLICY "Communications accessible by event owner" ON guest_communications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Guest Check-ins - Only event owner
CREATE POLICY "Check-ins accessible by event owner" ON guest_checkins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- PART 5: HELPER FUNCTIONS
-- ============================================

-- Function to update budget category totals
CREATE OR REPLACE FUNCTION update_budget_category_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE budget_categories
    SET 
      spent_amount = (
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE category_id = NEW.category_id
          AND status != 'cancelled'
      ),
      remaining_amount = allocated_amount - (
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE category_id = NEW.category_id
          AND status != 'cancelled'
      ),
      updated_at = NOW()
    WHERE id = NEW.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update category totals
CREATE TRIGGER trigger_update_category_totals
AFTER INSERT OR UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_budget_category_totals();

-- Function to update budget totals
CREATE OR REPLACE FUNCTION update_budget_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE budgets
  SET
    spent_amount = (
      SELECT COALESCE(SUM(spent_amount), 0)
      FROM budget_categories
      WHERE budget_id = NEW.budget_id
    ),
    remaining_amount = total_budget - (
      SELECT COALESCE(SUM(spent_amount), 0)
      FROM budget_categories
      WHERE budget_id = NEW.budget_id
    ),
    updated_at = NOW()
  WHERE id = NEW.budget_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update budget totals
CREATE TRIGGER trigger_update_budget_totals
AFTER UPDATE ON budget_categories
FOR EACH ROW
EXECUTE FUNCTION update_budget_totals();

-- Function to update guest group counts
CREATE OR REPLACE FUNCTION update_guest_group_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_groups
    SET guest_count = guest_count + 1
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_groups
    SET guest_count = guest_count - 1
    WHERE id = OLD.group_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update group counts
CREATE TRIGGER trigger_update_group_counts
AFTER INSERT OR DELETE ON guest_group_members
FOR EACH ROW
EXECUTE FUNCTION update_guest_group_counts();

-- Function to update table occupied seats
CREATE OR REPLACE FUNCTION update_table_occupied_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seating_tables
    SET occupied_seats = occupied_seats + 1
    WHERE id = NEW.table_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seating_tables
    SET occupied_seats = occupied_seats - 1
    WHERE id = OLD.table_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.table_id != OLD.table_id THEN
    UPDATE seating_tables SET occupied_seats = occupied_seats - 1 WHERE id = OLD.table_id;
    UPDATE seating_tables SET occupied_seats = occupied_seats + 1 WHERE id = NEW.table_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update occupied seats
CREATE TRIGGER trigger_update_occupied_seats
AFTER INSERT OR UPDATE OR DELETE ON seating_assignments
FOR EACH ROW
EXECUTE FUNCTION update_table_occupied_seats();

-- ============================================
-- PHASE 05 SCHEMA COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this schema in Supabase SQL Editor
-- 2. Verify all tables and indexes are created
-- 3. Test RLS policies
-- 4. Implement frontend components
-- 5. Build budget tracking and guest management features
