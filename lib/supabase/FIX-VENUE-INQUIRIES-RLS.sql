-- =====================================================
-- FIX VENUE INQUIRIES RLS POLICIES
-- =====================================================
-- Allow anyone to submit venue inquiries (customer portal)

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view own inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Venue owners can view inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Admin can view all inquiries" ON venue_inquiries;

-- Enable RLS
ALTER TABLE venue_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (even anonymous) can INSERT inquiries
CREATE POLICY "Anyone can submit venue inquiries"
  ON venue_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Users can view their own inquiries (if logged in)
CREATE POLICY "Users can view own inquiries"
  ON venue_inquiries
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Policy 3: Venue owners can view inquiries for their venues
CREATE POLICY "Venue owners can view their venue inquiries"
  ON venue_inquiries
  FOR SELECT
  USING (
    venue_id IN (
      SELECT id FROM venues WHERE owner_id = auth.uid()
    )
  );

-- Policy 4: Admin and venue owners can update inquiries
CREATE POLICY "Authorized users can update inquiries"
  ON venue_inquiries
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    OR
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

SELECT '✅ Venue inquiries RLS policies fixed!' as result;
SELECT '✅ Anyone can now submit venue inquiries' as info;
