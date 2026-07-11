-- ============================================================
-- CREATE SAVED VENDORS FEATURE
-- Allows customers to bookmark/save vendors for later
-- ============================================================

-- Create saved_vendors table
CREATE TABLE IF NOT EXISTS saved_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure one user can't save same vendor twice
  UNIQUE(user_id, vendor_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_vendors_user ON saved_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_vendors_vendor ON saved_vendors(vendor_id);

-- Enable RLS
ALTER TABLE saved_vendors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own saved vendors
DROP POLICY IF EXISTS "users_view_own_saved_vendors" ON saved_vendors;
CREATE POLICY "users_view_own_saved_vendors"
  ON saved_vendors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can save vendors
DROP POLICY IF EXISTS "users_can_save_vendors" ON saved_vendors;
CREATE POLICY "users_can_save_vendors"
  ON saved_vendors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave vendors
DROP POLICY IF EXISTS "users_can_unsave_vendors" ON saved_vendors;
CREATE POLICY "users_can_unsave_vendors"
  ON saved_vendors
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

SELECT '✅ Saved vendors table created successfully!' as result;
SELECT 'Users can now save vendors and view them in dashboard' as info;
