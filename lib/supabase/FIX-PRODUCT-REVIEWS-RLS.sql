-- =====================================================
-- FIX PRODUCT REVIEWS RLS
-- Allow public to view approved reviews
-- =====================================================

-- Enable RLS if not already enabled
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "public_view_approved_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_view_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_create_reviews" ON product_reviews;
DROP POLICY IF EXISTS "users_update_own_reviews" ON product_reviews;

-- Allow anyone (including anonymous) to view approved reviews
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

-- Allow users to view their own reviews (even if not approved)
CREATE POLICY "users_view_own_reviews"
  ON product_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update their own reviews (within 24 hours)
CREATE POLICY "users_update_own_reviews"
  ON product_reviews
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '24 hours'
  );

-- Allow admins to view and update all reviews
CREATE POLICY "admins_manage_reviews"
  ON product_reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

SELECT '✅ Product reviews RLS policies created!' as result;
SELECT '✅ Public can now view approved reviews' as status;
