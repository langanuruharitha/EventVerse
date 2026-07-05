-- =====================================================
-- DEBUG: Check Vendor User Role
-- =====================================================

-- Check the specific vendor user
SELECT 
  id,
  email,
  role,
  status,
  CASE 
    WHEN role = 'vendor' THEN '✅ Should redirect to /vendor/dashboard'
    WHEN role = 'customer' THEN '❌ Will redirect to /dashboard (WRONG!)'
    WHEN role = 'admin' THEN '✅ Should redirect to /admin/dashboard'
    ELSE '❓ Unknown role'
  END as expected_behavior
FROM users
WHERE email = '24091a31f05@mitic.ac.in';

-- Check auth.users metadata
SELECT 
  email,
  raw_user_meta_data->>'role' as metadata_role,
  raw_user_meta_data->>'full_name' as metadata_name
FROM auth.users
WHERE email = '24091a31f05@mitic.ac.in';

-- Check ALL users roles
SELECT 
  email,
  role,
  status
FROM users
ORDER BY created_at DESC;

SELECT '✅ Diagnostic complete!' as status;
