-- =====================================================
-- AUTO-CREATE VENDOR PROFILE ON SIGNUP
-- =====================================================
-- This trigger automatically creates vendor_profiles entry
-- when a user with role='vendor' is created

-- Create the function
CREATE OR REPLACE FUNCTION auto_create_vendor_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- If new user has vendor role, create vendor profile
  IF NEW.role = 'vendor' THEN
    INSERT INTO vendor_profiles (
      user_id,
      business_name,
      business_category,
      business_description,
      verification_status,
      is_active,
      created_at,
      updated_at
    )
    SELECT 
      NEW.id,
      COALESCE(up.full_name, NEW.email, 'Vendor Business'),
      'Event Services',
      'Professional event services provider',
      'pending',
      true,
      NOW(),
      NOW()
    FROM user_profiles up
    WHERE up.user_id = NEW.id
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS create_vendor_profile_on_user_create ON users;

-- Create the trigger
CREATE TRIGGER create_vendor_profile_on_user_create
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_vendor_profile();

-- Backfill: Create vendor profiles for existing vendor users
INSERT INTO vendor_profiles (
  user_id,
  business_name,
  business_category,
  business_description,
  verification_status,
  is_active,
  created_at,
  updated_at
)
SELECT 
  u.id,
  COALESCE(up.full_name, u.email, 'Vendor Business'),
  'Event Services',
  'Professional event services provider',
  'pending',
  true,
  NOW(),
  NOW()
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.role = 'vendor'
  AND NOT EXISTS (
    SELECT 1 FROM vendor_profiles vp WHERE vp.user_id = u.id
  );

-- Verify
SELECT 
  u.email,
  u.role,
  vp.business_name,
  vp.is_active,
  '✅ Has vendor profile!' as status
FROM users u
JOIN vendor_profiles vp ON vp.user_id = u.id
WHERE u.role = 'vendor';

SELECT '✅ Trigger created and existing vendors backfilled!' as result;
