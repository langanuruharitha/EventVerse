-- =====================================================
-- FIX VENUE REVIEWS RLS POLICIES
-- =====================================================
-- Allow public to read approved reviews

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved reviews" ON venue_reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON venue_reviews;
DROP POLICY IF EXISTS "Public read access" ON venue_reviews;

-- Enable RLS
ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved reviews (no auth required)
CREATE POLICY "allow_public_read_approved_reviews"
  ON venue_reviews
  FOR SELECT
  USING (is_approved = true);

-- Policy: Authenticated users can insert reviews
CREATE POLICY "allow_authenticated_insert_reviews"
  ON venue_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

SELECT '✅ Venue reviews RLS policies fixed!' as result;
SELECT '✅ Public can now read approved reviews' as info;
