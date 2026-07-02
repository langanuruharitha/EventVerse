-- Vendor Services
CREATE TABLE IF NOT EXISTS vendor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  starting_price DECIMAL(10,2),
  price_type VARCHAR(50), -- fixed, hourly, daily, custom
  duration_hours INT,
  max_guests_supported INT,
  includes TEXT[],
  excludes TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor ON vendor_services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_services_category ON vendor_services(category);

-- Vendor Packages
CREATE TABLE IF NOT EXISTS vendor_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  package_name VARCHAR(255) NOT NULL,
  package_type VARCHAR(50), -- basic, standard, premium, luxury
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  guest_range_min INT,
  guest_range_max INT,
  services_included JSONB,
  package_highlights TEXT[],
  is_customizable BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  validity_days INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_packages_vendor ON vendor_packages(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_type ON vendor_packages(package_type);

-- Vendor Bookings/Inquiries
CREATE TABLE IF NOT EXISTS vendor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  service_id UUID REFERENCES vendor_services(id),
  package_id UUID REFERENCES vendor_packages(id),
  
  event_type VARCHAR(100),
  event_date DATE,
  guest_count INT,
  venue_location TEXT,
  
  budget_range VARCHAR(100),
  requirements TEXT,
  
  status VARCHAR(50) DEFAULT 'pending', -- pending, replied, accepted, declined
  vendor_response TEXT,
  responded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_vendor ON vendor_inquiries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_user ON vendor_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_status ON vendor_inquiries(status);
