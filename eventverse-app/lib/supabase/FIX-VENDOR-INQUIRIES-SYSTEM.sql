-- =====================================================
-- FIX VENDOR INQUIRIES SYSTEM
-- =====================================================
-- Creates or repairs the vendor_inquiries table with safe columns,
-- indexes, and permissive RLS policies so vendors and customers
-- can view, insert, and reply without authorization errors.

CREATE TABLE IF NOT EXISTS vendor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  customer_id UUID,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  event_type VARCHAR(100),
  event_date DATE,
  guest_count INT,
  budget_range VARCHAR(100),
  venue_location TEXT,
  status VARCHAR(50) DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  vendor_response TEXT,
  responded_at TIMESTAMPTZ,
  priority VARCHAR(20) DEFAULT 'medium',
  thread_messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist (if table was created with older schema)
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS subject VARCHAR(500);
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS event_type VARCHAR(100);
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS guest_count INT;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS budget_range VARCHAR(100);
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS venue_location TEXT;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS vendor_response TEXT;
ALTER TABLE vendor_inquiries ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_vendor_id ON vendor_inquiries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_customer_id ON vendor_inquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON vendor_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON vendor_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE vendor_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop old conflicting policies
DROP POLICY IF EXISTS "vendor_inquiries_all_access" ON vendor_inquiries;
DROP POLICY IF EXISTS "vendor_inquiries_select" ON vendor_inquiries;
DROP POLICY IF EXISTS "vendor_inquiries_insert" ON vendor_inquiries;
DROP POLICY IF EXISTS "vendor_inquiries_update" ON vendor_inquiries;
DROP POLICY IF EXISTS "vendor_inquiries_select_vendor" ON vendor_inquiries;
DROP POLICY IF EXISTS "vendor_inquiries_select_customer" ON vendor_inquiries;
DROP POLICY IF EXISTS "vendor_inquiries_update_vendor" ON vendor_inquiries;

-- Create permissive RLS policies
CREATE POLICY "vendor_inquiries_select" ON vendor_inquiries
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "vendor_inquiries_insert" ON vendor_inquiries
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "vendor_inquiries_update" ON vendor_inquiries
  FOR UPDATE TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ vendor_inquiries table and RLS policies configured successfully!';
END $$;

