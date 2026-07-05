-- =====================================================
-- CREATE VENDOR PROFILE - WITH ALL REQUIRED FIELDS
-- =====================================================

-- Simple version: Insert directly with required fields
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
  au.id as user_id,
  COALESCE(up.full_name, 'Vendor Business') as business_name,
  'Event Services' as business_category,
  'Professional event services provider' as business_description,
  'pending' as verification_status,
  true as is_active,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
WHERE au.email = '24091a31f05@mitic.ac.in'
ON CONFLICT (user_id) DO UPDATE
SET 
  is_active = true,
  updated_at = NOW();

-- Verify it was created
SELECT 
  vp.id,
  vp.business_name,
  u.email,
  vp.is_active,
  vp.verification_status,
  '✅ Vendor profile exists!' as status
FROM vendor_profiles vp
JOIN users u ON u.id = vp.user_id
WHERE u.email = '24091a31f05@mitic.ac.in';
