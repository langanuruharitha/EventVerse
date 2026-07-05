-- =====================================================
-- CREATE VENDOR PROFILE FOR VENDOR USER
-- =====================================================
-- The middleware checks vendor_profiles table
-- We need to create an entry there for vendor users

DO $$
DECLARE
  vendor_user_id UUID;
  vendor_email TEXT;
  vendor_name TEXT;
BEGIN
  -- Get user ID and email
  SELECT id, email INTO vendor_user_id, vendor_email
  FROM auth.users 
  WHERE email = '24091a31f05@mitic.ac.in';
  
  -- Get full name from user_profiles or use email
  SELECT COALESCE(full_name, vendor_email) INTO vendor_name
  FROM user_profiles
  WHERE user_id = vendor_user_id;

  -- Insert vendor profile with required fields
  INSERT INTO vendor_profiles (
    user_id,
    business_name,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    vendor_user_id,
    COALESCE(vendor_name, 'Vendor Business'), -- Use name or default
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    is_active = true, 
    updated_at = NOW(),
    business_name = COALESCE(EXCLUDED.business_name, vendor_profiles.business_name);

  RAISE NOTICE '✅ Vendor profile created/updated!';
END $$;

-- Verify the vendor profile was created
SELECT 
  vp.id,
  vp.user_id,
  u.email,
  vp.business_name,
  vp.is_active,
  '✅ Vendor can now access /vendor/dashboard' as status
FROM vendor_profiles vp
JOIN users u ON u.id = vp.user_id
WHERE u.email = '24091a31f05@mitic.ac.in';
