-- ============================================
-- ADD VENDOR INQUIRIES TABLE
-- ============================================
-- This adds the internal messaging system between customers and vendors
-- Run this AFTER vendor-lead-system.sql

-- Drop table if exists (for clean install)
DROP TABLE IF EXISTS vendor_inquiries CASCADE;

-- ============================================
-- VENDOR INQUIRIES TABLE (Internal Messaging)
-- ============================================

CREATE TABLE vendor_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties (store UUIDs directly, no foreign keys to avoid conflicts)
  vendor_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  
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
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Vendor Response
  vendor_response TEXT,
  responded_at TIMESTAMP,
  
  -- Priority
  priority VARCHAR(20) DEFAULT 'medium',
  
  -- Conversation Thread
  thread_messages JSONB DEFAULT '[]'::jsonb,
  
  -- Follow-up
  requires_follow_up BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key to vendors table only (safe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendors') THEN
    ALTER TABLE vendor_inquiries 
    ADD CONSTRAINT fk_vendor_inquiries_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_inquiries_vendor ON vendor_inquiries(vendor_id, status, created_at DESC);
CREATE INDEX idx_inquiries_customer ON vendor_inquiries(customer_id, created_at DESC);
CREATE INDEX idx_inquiries_unread ON vendor_inquiries(vendor_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE vendor_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Vendors can view inquiries sent to them
CREATE POLICY "vendor_inquiries_select_vendor" ON vendor_inquiries
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = vendor_inquiries.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Policy 2: Customers can view their own inquiries
CREATE POLICY "vendor_inquiries_select_customer" ON vendor_inquiries
  FOR SELECT 
  TO authenticated
  USING (vendor_inquiries.customer_id = auth.uid());

-- Policy 3: Authenticated users can create inquiries
CREATE POLICY "vendor_inquiries_insert" ON vendor_inquiries
  FOR INSERT 
  TO authenticated
  WITH CHECK (vendor_inquiries.customer_id = auth.uid());

-- Policy 4: Vendors can update inquiries sent to them (to respond)
CREATE POLICY "vendor_inquiries_update_vendor" ON vendor_inquiries
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = vendor_inquiries.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ vendor_inquiries table created successfully!';
  RAISE NOTICE '📋 Table: vendor_inquiries';
  RAISE NOTICE '📊 Indexes: 3 indexes created';
  RAISE NOTICE '🔐 RLS Policies: 4 policies enabled';
  RAISE NOTICE '';
  RAISE NOTICE '✨ You can now use the internal messaging system!';
  RAISE NOTICE '👉 Customer sends message from vendor profile page';
  RAISE NOTICE '👉 Vendor views in /vendor/inquiries page';
END $$;
  RAISE NOTICE '✅ vendor_inquiries table created successfully!';
  RAISE NOTICE '📋 Table: vendor_inquiries';
  RAISE NOTICE '📊 Indexes: 3 indexes created';
  RAISE NOTICE '🔐 RLS Policies: 4 policies enabled';
  RAISE NOTICE '';
  RAISE NOTICE '✨ You can now use the internal messaging system!';
  RAISE NOTICE '👉 Customer sends message from vendor profile page';
  RAISE NOTICE '👉 Vendor views in /vendor/inquiries page';
END $$;
