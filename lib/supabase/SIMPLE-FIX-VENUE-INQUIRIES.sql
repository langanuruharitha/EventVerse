-- =====================================================
-- SIMPLE FIX FOR VENUE INQUIRIES - ALLOW INSERTS
-- =====================================================

-- Drop existing INSERT policies if they exist
DROP POLICY IF EXISTS "Anyone can submit venue inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON venue_inquiries;
DROP POLICY IF EXISTS "Enable insert for all users" ON venue_inquiries;

-- Create a simple INSERT policy that allows anyone to submit inquiries
CREATE POLICY "allow_insert_venue_inquiries"
  ON venue_inquiries
  FOR INSERT
  WITH CHECK (true);

SELECT '✅ Venue inquiry INSERT policy fixed!' as result;
