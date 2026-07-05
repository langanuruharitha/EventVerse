-- =====================================================
-- FIX VENDOR ROLES IN DATABASE
-- =====================================================
-- This script fixes users who signed up as vendor
-- but got customer role in the database
-- =====================================================

-- Step 1: Check for mismatched roles
SELECT 
  u.id,
  u.email,
  u.role as current_role_in_users_table,
  au.raw_user_meta_data->>'role' as role_from_signup
FROM users u
JOIN auth.users au ON au.id = u.id
WHERE au.raw_user_meta_data->>'role' IS NOT NULL
  AND u.role != au.raw_user_meta_data->>'role';

-- Step 2: Fix mismatched roles
-- This updates users table to match what they selected during signup
UPDATE users u
SET role = au.raw_user_meta_data->>'role'
FROM auth.users au
WHERE u.id = au.id
  AND au.raw_user_meta_data->>'role' IS NOT NULL
  AND u.role != au.raw_user_meta_data->>'role';

-- Step 3: Verify all users now have correct roles
SELECT 
  u.email,
  u.role as role_in_users_table,
  au.raw_user_meta_data->>'role' as role_from_signup,
  CASE 
    WHEN u.role = au.raw_user_meta_data->>'role' THEN '✅ Correct'
    WHEN au.raw_user_meta_data->>'role' IS NULL THEN '✅ Default (customer)'
    ELSE '❌ Mismatch'
  END as status
FROM users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC;

SELECT '✅ Vendor roles fixed!' as message;
SELECT 'Users who signed up as vendor now have vendor role' as info;
