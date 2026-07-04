-- ============================================
-- EVENTVERSE - COMPLETE DATABASE SETUP
-- ============================================
-- Run this ONCE in Supabase SQL Editor to fix all issues:
-- 1. Event creation (timing constraint)
-- 2. Guest management (missing columns)
-- 3. Vendor inquiry system
-- 4. RLS policies
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🚀 Starting EventVerse Complete Database Setup...';
  RAISE NOTICE '';
END $$;

-- ============================================
-- FIX 1: EVENT TIMING CONSTRAINT
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fix 1: Event Timing Constraint...';
END $$;

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_timing_check;

ALTER TABLE events ADD CONSTRAINT events_event_timing_check 
CHECK (event_timing IN ('morning', 'afternoon', 'evening', 'night', 'full_day'));

DO $$
BEGIN
  RAISE NOTICE '✅ Event timing fixed (now allows: morning, afternoon, evening, night, full_day)';
  RAISE NOTICE '';
END $$;

-- ============================================
-- FIX 2: GUEST MANAGEMENT COLUMNS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fix 2: Guest Management Columns...';
END $$;

-- Add guest_name column
ALTER TABLE guests ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);
UPDATE guests SET guest_name = full_name WHERE guest_name IS NULL;

-- Add additional guest columns
ALTER TABLE guests ADD COLUMN IF NOT EXISTS city VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS age_group VARCHAR(20) DEFAULT 'adult';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_allowed INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_confirmed INT DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_guests_city ON guests(city);
CREATE INDEX IF NOT EXISTS idx_guests_category ON guests(category);
CREATE INDEX IF NOT EXISTS idx_guests_age_group ON guests(age_group);

DO $$
BEGIN
  RAISE NOTICE '✅ Guest columns added successfully';
  RAISE NOTICE '';
END $$;

-- ============================================
-- FIX 3: VENDOR INQUIRY SYSTEM
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fix 3: Vendor Inquiry System...';
END $$;

-- Create vendor_inquiries table
CREATE TABLE IF NOT EXISTS vendor_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'responded')),
  vendor_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_vendor_id ON vendor_inquiries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_customer_id ON vendor_inquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_event_id ON vendor_inquiries(event_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_status ON vendor_inquiries(status);

-- Enable RLS
ALTER TABLE vendor_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Vendors can view their inquiries" ON vendor_inquiries;
DROP POLICY IF EXISTS "Customers can view their inquiries" ON vendor_inquiries;
DROP POLICY IF EXISTS "Customers can create inquiries" ON vendor_inquiries;
DROP POLICY IF EXISTS "Vendors can update inquiry status" ON vendor_inquiries;

-- Create RLS policies
CREATE POLICY "Vendors can view their inquiries"
ON vendor_inquiries FOR SELECT
USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can view their inquiries"
ON vendor_inquiries FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create inquiries"
ON vendor_inquiries FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can update inquiry status"
ON vendor_inquiries FOR UPDATE
USING (auth.uid() = vendor_id);

DO $$
BEGIN
  RAISE NOTICE '✅ Vendor inquiry system installed';
  RAISE NOTICE '';
END $$;

-- ============================================
-- FIX 4: EVENT RLS POLICIES
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fix 4: Event RLS Policies...';
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create correct RLS policies
CREATE POLICY "Users can insert their own events"
ON events FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events"
ON events FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
ON events FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
ON events FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ Event RLS policies configured';
  RAISE NOTICE '';
END $$;

-- ============================================
-- FIX 5: GUEST RLS POLICIES
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fix 5: Guest RLS Policies...';
END $$;

-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their event guests" ON guests;
DROP POLICY IF EXISTS "Users can view their event guests" ON guests;
DROP POLICY IF EXISTS "Users can insert guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can update guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can delete guests for their events" ON guests;

-- Create RLS policies for guests
CREATE POLICY "Users can view their event guests"
ON guests FOR SELECT TO authenticated
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert guests for their events"
ON guests FOR INSERT TO authenticated
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update guests for their events"
ON guests FOR UPDATE TO authenticated
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete guests for their events"
ON guests FOR DELETE TO authenticated
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

DO $$
BEGIN
  RAISE NOTICE '✅ Guest RLS policies configured';
  RAISE NOTICE '';
END $$;

-- ============================================
-- FINAL SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '╔═══════════════════════════════════════════════╗';
  RAISE NOTICE '║   🎉 EVENTVERSE DATABASE SETUP COMPLETE! 🎉   ║';
  RAISE NOTICE '╚═══════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Event creation - FIXED';
  RAISE NOTICE '✅ Guest management - FIXED';
  RAISE NOTICE '✅ Vendor inquiries - INSTALLED';
  RAISE NOTICE '✅ RLS policies - CONFIGURED';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Features Now Working:';
  RAISE NOTICE '  • Create events with any timing (morning/afternoon/evening/night/full_day)';
  RAISE NOTICE '  • Add and manage guests with full details';
  RAISE NOTICE '  • Send inquiries to vendors (internal messaging)';
  RAISE NOTICE '  • Secure data access with RLS policies';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Your EventVerse app is ready to deploy!';
  RAISE NOTICE '';
END $$;
