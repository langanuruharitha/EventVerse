-- =====================================================
-- FINAL FIX FOR VENUE INQUIRIES RLS
-- =====================================================

-- Disable RLS temporarily
ALTER TABLE venue_inquiries DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "allow_insert_venue_inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Anyone can submit venue inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Enable insert for all users" ON venue_inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Venue owners can view their venue inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Authorized users can update inquiries" ON venue_inquiries;

-- Re-enable RLS
ALTER TABLE venue_inquiries ENABLE ROW LEVEL SECURITY;

-- Create simple policy: ANYONE can insert (even anonymous)
CREATE POLICY "public_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Users can view their own inquiries
CREATE POLICY "users_view_own_inquiries"
  ON venue_inquiries
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: Venue owners can view inquiries for their venues
CREATE POLICY "venue_owners_view_inquiries"
  ON venue_inquiries
  FOR SELECT
  TO authenticated
  USING (
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

-- Policy: Admins and venue owners can update
CREATE POLICY "authorized_update_inquiries"
  ON venue_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    OR
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

SELECT '✅ Venue inquiries RLS fixed - anyone can now submit!' as result;
