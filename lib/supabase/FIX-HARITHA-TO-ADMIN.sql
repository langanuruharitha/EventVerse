-- =====================================================
-- FIX: Change harithalanganuru@gmail.com to Admin Role
-- =====================================================
-- This updates your account from 'customer' to 'admin'

-- Step 1: Update the users table to set role as 'admin'
UPDATE users
SET role = 'admin'
WHERE email = 'harithalanganuru@gmail.com';

-- Step 2: Verify the change
SELECT 
  id,
  email,
  role,
  created_at
FROM users
WHERE email = 'harithalanganuru@gmail.com';

-- Step 3: Also update the user_profiles table if it exists
UPDATE user_profiles
SET updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM users WHERE email = 'harithalanganuru@gmail.com'
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check all admin users
SELECT 
  email,
  role,
  created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Success message
SELECT 'harithalanganuru@gmail.com is now an ADMIN! ✅' as status;
