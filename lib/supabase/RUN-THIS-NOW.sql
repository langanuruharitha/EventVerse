-- =====================================================
-- COMPLETE FIX FOR VENUE INQUIRIES & PRODUCT REVIEWS
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- ============= PART 1: FIX VENUE INQUIRIES =============
DO $$ 
BEGIN
  RAISE NOTICE '🔧 Starting venue inquiries fix...';
END $$;

-- Make user_id nullable (allow anonymous inquiries)
ALTER TABLE venue_inquiries 
ALTER COLUMN user_id DROP NOT NULL;

-- Disable RLS temporarily
ALTER TABLE venue_inquiries DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for venue_inquiries
DROP POLICY IF EXISTS "allow_insert_venue_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Anyone can submit venue inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Enable insert for all users" ON venue_inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Venue owners can view their venue inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Authorized users can update inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "public_insert_venue_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "users_view_own_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "venue_owners_view_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "authorized_update_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "anon_insert_venue_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "authenticated_insert_venue_inquiries" ON venue_inquiries;

-- Re-enable RLS
ALTER TABLE venue_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous users
CREATE POLICY "anon_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "public_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own inquiries
CREATE POLICY "users_view_own_inquiries"
  ON venue_inquiries
  FOR SELECT
  TO authenticated
  USING (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Venue owners can view inquiries for their venues
CREATE POLICY "venue_owners_view_inquiries"
  ON venue_inquiries
  FOR SELECT
  TO authenticated
  USING (
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

-- Admins and venue owners can update
CREATE POLICY "authorized_update_inquiries"
  ON venue_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    OR
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

-- Grant permissions to anon role
GRANT INSERT ON venue_inquiries TO anon;
GRANT USAGE ON SCHEMA public TO anon;

DO $$ 
BEGIN
  RAISE NOTICE '✅ Venue inquiries fixed! Anonymous users can now submit.';
END $$;

-- ============= PART 2: FIX PRODUCT REVIEWS =============
DO $$ 
BEGIN
  RAISE NOTICE '🔧 Starting product reviews fix...';
END $$;

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "public_view_approved_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_view_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_create_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_update_own_reviews" ON product_reviews;
DROP POLICY IF EXISTS "authenticated_create_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_view_own_reviews" ON product_reviews;
DROP POLICY IF EXISTS "admins_manage_reviews" ON product_reviews;

-- Allow anyone to view approved reviews
CREATE POLICY "public_view_approved_reviews"
  ON product_reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Allow authenticated users to create reviews
CREATE POLICY "authenticated_create_reviews"
  ON product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own reviews
CREATE POLICY "users_view_own_reviews"
  ON product_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update own reviews (within 24 hours)
CREATE POLICY "users_update_own_reviews"
  ON product_reviews
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '24 hours'
  );

-- Allow admins to manage all reviews
CREATE POLICY "admins_manage_reviews"
  ON product_reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DO $$ 
BEGIN
  RAISE NOTICE '✅ Product reviews fixed! Public can view approved reviews.';
END $$;

-- ============= VERIFICATION =============
DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ALL FIXES APPLIED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Summary:';
  RAISE NOTICE '  1. Venue inquiries: user_id is now nullable';
  RAISE NOTICE '  2. Venue inquiries: RLS policies allow anonymous submissions';
  RAISE NOTICE '  3. Product reviews: RLS policies allow public viewing';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Next Steps:';
  RAISE NOTICE '  1. Deploy frontend changes (git push)';
  RAISE NOTICE '  2. Test venue inquiry form without logging in';
  RAISE NOTICE '  3. Check product reviews are displaying';
  RAISE NOTICE '';
END $$;

-- Quick verification counts
SELECT 
  'Venue Inquiries' as table_name,
  COUNT(*) as total_rows
FROM venue_inquiries
UNION ALL
SELECT 
  'Product Reviews' as table_name,
  COUNT(*) as total_rows
FROM product_reviews
UNION ALL
SELECT 
  'Venue Reviews' as table_name,
  COUNT(*) as total_rows
FROM venue_reviews;

-- Show RLS status
SELECT 
  'venue_inquiries' as table_name,
  relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'venue_inquiries'
UNION ALL
SELECT 
  'product_reviews' as table_name,
  relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'product_reviews';
