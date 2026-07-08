-- =====================================================
-- COMPLETE FIX FOR VENUE INQUIRIES
-- Makes user_id nullable and fixes RLS policies
-- =====================================================

-- Step 1: Make user_id nullable (allow anonymous inquiries)
ALTER TABLE venue_inquiries 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Disable RLS
ALTER TABLE venue_inquiries DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies
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

-- Step 4: Re-enable RLS
ALTER TABLE venue_inquiries ENABLE ROW LEVEL SECURITY;

-- Step 5: Create ANON-friendly policies

-- CRITICAL: Allow anonymous (public/anon role) to insert inquiries
CREATE POLICY "anon_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "authenticated_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow public to insert (covers both anon and authenticated)
CREATE POLICY "public_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own inquiries (if logged in)
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

-- Step 6: Grant permissions to anon role
GRANT INSERT ON venue_inquiries TO anon;
GRANT USAGE ON SCHEMA public TO anon;

SELECT '✅ COMPLETE FIX APPLIED:' as status;
SELECT '✅ user_id is now nullable (allows anonymous inquiries)' as fix1;
SELECT '✅ RLS policies created for anon, authenticated, and public roles' as fix2;
SELECT '✅ Permissions granted to anon role' as fix3;
SELECT 'Now test the inquiry form!' as action;
