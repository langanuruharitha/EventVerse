-- ================================================================
-- PHASE 04: VENUE EXPLORER & INVITATION SYSTEM
-- EventVerse Database Schema
-- ================================================================

-- ================================================================
-- 1. VENUE MANAGEMENT SYSTEM
-- ================================================================

-- Venue Categories
CREATE TABLE IF NOT EXISTS venue_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Main Venues Table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES venue_categories(id),
  venue_type VARCHAR(100), -- banquet_hall, garden, resort, etc.
  description TEXT,
  highlights TEXT[],
  
  -- Location
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  pincode VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Capacity
  seated_capacity_min INT,
  seated_capacity_max INT,
  standing_capacity INT,
  
  -- Pricing
  weekday_price DECIMAL(12, 2),
  weekend_price DECIMAL(12, 2),
  peak_season_price DECIMAL(12, 2),
  per_plate_veg_min DECIMAL(10, 2),
  per_plate_veg_max DECIMAL(10, 2),
  per_plate_nonveg_min DECIMAL(10, 2),
  per_plate_nonveg_max DECIMAL(10, 2),
  security_deposit DECIMAL(12, 2),
  
  -- Features & Amenities
  is_ac BOOLEAN DEFAULT FALSE,
  is_outdoor BOOLEAN DEFAULT FALSE,
  parking_cars INT DEFAULT 0,
  parking_bikes INT DEFAULT 0,
  has_wifi BOOLEAN DEFAULT FALSE,
  has_power_backup BOOLEAN DEFAULT FALSE,
  allows_outside_catering BOOLEAN DEFAULT FALSE,
  allows_alcohol BOOLEAN DEFAULT FALSE,
  is_wheelchair_accessible BOOLEAN DEFAULT FALSE,
  has_accommodation BOOLEAN DEFAULT FALSE,
  accommodation_rooms INT DEFAULT 0,
  
  -- Media
  primary_image_url TEXT,
  images TEXT[],
  video_urls TEXT[],
  virtual_tour_url TEXT,
  
  -- Status & Verification
  verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  listing_status VARCHAR(50) DEFAULT 'draft', -- draft, active, inactive
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Stats
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  view_count INT DEFAULT 0,
  inquiry_count INT DEFAULT 0,
  booking_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Venue Availability
CREATE TABLE IF NOT EXISTS venue_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  slot VARCHAR(50), -- morning, afternoon, evening, full_day
  status VARCHAR(50) DEFAULT 'available', -- available, booked, blocked
  price_override DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(venue_id, date, slot)
);

-- Venue Inquiries
CREATE TABLE IF NOT EXISTS venue_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Contact Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Event Details
  event_type VARCHAR(100),
  event_date DATE,
  guest_count INT,
  budget_range VARCHAR(100),
  time_slot VARCHAR(50),
  message TEXT,
  specific_requirements TEXT,
  
  -- Status & Response
  status VARCHAR(50) DEFAULT 'pending', -- pending, responded, converted, rejected
  priority VARCHAR(20) DEFAULT 'normal',
  response_text TEXT,
  quoted_price DECIMAL(12, 2),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Venue Bookings
CREATE TABLE IF NOT EXISTS venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  inquiry_id UUID REFERENCES venue_inquiries(id) ON DELETE SET NULL,
  
  -- Event Details
  event_type VARCHAR(100),
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  time_slot VARCHAR(50),
  guest_count INT NOT NULL,
  
  -- Pricing
  venue_rental_cost DECIMAL(12, 2),
  catering_cost DECIMAL(12, 2),
  decoration_cost DECIMAL(12, 2),
  additional_services_cost DECIMAL(12, 2),
  subtotal DECIMAL(12, 2),
  service_charge DECIMAL(12, 2),
  tax_amount DECIMAL(12, 2),
  total_amount DECIMAL(12, 2),
  security_deposit DECIMAL(12, 2),
  
  -- Payment Status
  advance_paid DECIMAL(12, 2) DEFAULT 0.00,
  balance_amount DECIMAL(12, 2),
  deposit_paid BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Requirements
  special_requirements TEXT,
  dietary_preferences TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Venue Reviews
CREATE TABLE IF NOT EXISTS venue_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES venue_bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  images TEXT[],
  verified_booking BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- 2. INVITATION SYSTEM
-- ================================================================

-- Invitation Templates
CREATE TABLE IF NOT EXISTS invitation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- birthday, wedding, engagement, etc.
  style VARCHAR(100), -- modern, traditional, elegant, fun
  orientation VARCHAR(20), -- portrait, landscape, square
  color_scheme VARCHAR(100),
  thumbnail_url TEXT NOT NULL,
  template_data JSONB NOT NULL, -- design structure
  is_premium BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Custom Invitations
CREATE TABLE IF NOT EXISTS custom_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  invitation_name VARCHAR(255),
  
  -- Type & Format
  invitation_type VARCHAR(50), -- card, video, voice, social_story
  design_data JSONB, -- complete design structure
  
  -- Generated Assets
  card_url TEXT, -- PNG/PDF invitation
  video_url TEXT, -- MP4 video invitation
  voice_url TEXT, -- MP3 voice message
  social_story_url TEXT, -- Vertical format for stories
  
  -- AI Generation Details
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT,
  generation_parameters JSONB,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, ready, sent
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invitation Distribution
CREATE TABLE IF NOT EXISTS invitation_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES custom_invitations(id) ON DELETE CASCADE,
  guest_id UUID, -- Optional link to guest list
  
  -- Contact Details
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Delivery Status
  sent_via VARCHAR(50), -- email, whatsapp, sms, download
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  
  -- RSVP Details
  rsvp_status VARCHAR(20), -- pending, yes, no, maybe
  rsvp_at TIMESTAMPTZ,
  guest_count INT DEFAULT 1,
  meal_preference VARCHAR(100),
  dietary_restrictions TEXT,
  message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RSVP Forms Configuration
CREATE TABLE IF NOT EXISTS rsvp_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES custom_invitations(id) ON DELETE CASCADE,
  form_fields JSONB NOT NULL, -- dynamic form configuration
  deadline_date DATE,
  thank_you_message TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ================================================================

-- Venue indexes
CREATE INDEX IF NOT EXISTS idx_venues_owner ON venues(owner_id);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category_id);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_status ON venues(listing_status);
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues(latitude, longitude);

-- Venue booking indexes
CREATE INDEX IF NOT EXISTS idx_venue_bookings_venue ON venue_bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_user ON venue_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_event ON venue_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_status ON venue_bookings(status);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_date ON venue_bookings(event_date);

-- Venue inquiry indexes
CREATE INDEX IF NOT EXISTS idx_venue_inquiries_venue ON venue_inquiries(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_inquiries_user ON venue_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_inquiries_status ON venue_inquiries(status);

-- Invitation indexes
CREATE INDEX IF NOT EXISTS idx_custom_invitations_user ON custom_invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_invitations_event ON custom_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_invitation_recipients_invitation ON invitation_recipients(invitation_id);
CREATE INDEX IF NOT EXISTS idx_invitation_recipients_email ON invitation_recipients(email);

-- ================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS
ALTER TABLE venue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_forms ENABLE ROW LEVEL SECURITY;

-- Venue policies (drop existing first)
DROP POLICY IF EXISTS "Everyone can view active venues" ON venues;
DROP POLICY IF EXISTS "Venue owners can manage their venues" ON venues;

CREATE POLICY "Everyone can view active venues" ON venues
  FOR SELECT USING (listing_status = 'active');

CREATE POLICY "Venue owners can manage their venues" ON venues
  FOR ALL USING (auth.uid() = owner_id);

-- Venue booking policies (drop existing first)
DROP POLICY IF EXISTS "Users can view their own bookings" ON venue_bookings;
DROP POLICY IF EXISTS "Venue owners can view their venue bookings" ON venue_bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON venue_bookings;

CREATE POLICY "Users can view their own bookings" ON venue_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Venue owners can view their venue bookings" ON venue_bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM venues WHERE venues.id = venue_bookings.venue_id AND venues.owner_id = auth.uid())
  );

CREATE POLICY "Users can create bookings" ON venue_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Invitation policies (drop existing first)
DROP POLICY IF EXISTS "Users can manage their invitations" ON custom_invitations;
DROP POLICY IF EXISTS "Users can manage invitation recipients" ON invitation_recipients;
DROP POLICY IF EXISTS "Anyone can view RSVP forms" ON rsvp_forms;
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON invitation_recipients;

CREATE POLICY "Users can manage their invitations" ON custom_invitations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage invitation recipients" ON invitation_recipients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM custom_invitations WHERE custom_invitations.id = invitation_recipients.invitation_id AND custom_invitations.user_id = auth.uid())
  );

-- Public RSVP access (anyone with link can respond)
CREATE POLICY "Anyone can view RSVP forms" ON rsvp_forms
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can submit RSVP" ON invitation_recipients
  FOR UPDATE USING (TRUE);

-- ================================================================
-- 5. FUNCTIONS & TRIGGERS
-- ================================================================

-- Generate venue booking number
CREATE OR REPLACE FUNCTION generate_venue_booking_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'VB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking number
CREATE OR REPLACE FUNCTION set_venue_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
    NEW.booking_number := generate_venue_booking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_venue_booking_number ON venue_bookings;
CREATE TRIGGER trigger_set_venue_booking_number
  BEFORE INSERT ON venue_bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_venue_booking_number();

-- Update venue rating trigger
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE venues
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM venue_reviews
      WHERE venue_id = NEW.venue_id AND is_approved = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM venue_reviews
      WHERE venue_id = NEW.venue_id AND is_approved = TRUE
    ),
    updated_at = now()
  WHERE id = NEW.venue_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_venue_rating ON venue_reviews;
CREATE TRIGGER trigger_update_venue_rating
  AFTER INSERT OR UPDATE OR DELETE ON venue_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_venue_rating();

-- ================================================================
-- 6. SAMPLE DATA
-- ================================================================

-- Insert venue categories
INSERT INTO venue_categories (category_name, description, display_order, is_active) VALUES
  ('Banquet Halls', 'Indoor banquet halls for large gatherings', 1, TRUE),
  ('Garden Venues', 'Outdoor garden spaces for intimate events', 2, TRUE),
  ('Resorts', 'Full-service resort properties', 3, TRUE),
  ('Hotels', 'Hotel conference and banquet facilities', 4, TRUE),
  ('Farmhouses', 'Private farmhouse properties', 5, TRUE),
  ('Rooftop Venues', 'Urban rooftop event spaces', 6, TRUE)
ON CONFLICT (category_name) DO NOTHING;

-- Insert sample invitation templates
INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium) VALUES
  ('Classic Wedding', 'wedding', 'elegant', 'portrait', 'gold-white', 'https://placehold.co/600x800/FFD700/white?text=Classic+Wedding', '{"layout":"centered","fonts":["Playfair Display","Lato"]}', FALSE),
  ('Modern Birthday', 'birthday', 'modern', 'landscape', 'rainbow', 'https://placehold.co/800x600/FF69B4/white?text=Modern+Birthday', '{"layout":"asymmetric","fonts":["Montserrat","Open Sans"]}', FALSE),
  ('Traditional Engagement', 'engagement', 'traditional', 'portrait', 'red-gold', 'https://placehold.co/600x800/DC143C/gold?text=Traditional+Engagement', '{"layout":"ornate","fonts":["Crimson Text","Merriweather"]}', TRUE)
ON CONFLICT DO NOTHING;

-- ================================================================
-- DONE! Phase 04 schema created successfully!
-- ================================================================
