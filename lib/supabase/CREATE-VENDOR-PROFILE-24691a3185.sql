-- =====================================================
-- CREATE VENDOR PROFILE FOR 24691a3185@mits.ac.in
-- =====================================================

-- Create vendor profile with all required fields
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
  u.id as user_id,
  COALESCE(up.full_name || '''s Business', 'Vendor Business') as business_name,
  'Event Services' as business_category,
  'Professional event services provider' as business_description,
  'pending' as verification_status,
  true as is_active,
  NOW() as created_at,
  NOW() as updated_at
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = '24691a3185@mits.ac.in'
ON CONFLICT (user_id) DO UPDATE
SET 
  business_name = EXCLUDED.business_name,
  is_active = true,
  updated_at = NOW();

-- Verify the vendor profile was created
SELECT 
  vp.id as vendor_profile_id,
  vp.business_name,
  u.email,
  u.role,
  vp.is_active,
  vp.verification_status,
  '✅ Vendor profile created!' as status
FROM vendor_profiles vp
JOIN users u ON u.id = vp.user_id
WHERE u.email = '24691a3185@mits.ac.in';

-- Verify user has vendor role
SELECT 
  email,
  role,
  status,
  CASE 
    WHEN role = 'vendor' THEN '✅ User has vendor role'
    ELSE '❌ User does NOT have vendor role'
  END as role_check
FROM users
WHERE email = '24691a3185@mits.ac.in';
