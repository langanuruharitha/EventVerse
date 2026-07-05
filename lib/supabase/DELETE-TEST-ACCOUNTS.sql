-- =====================================================
-- DELETE TEST ACCOUNTS
-- =====================================================
-- This removes test/fake accounts from the database

-- Step 1: Delete test customer accounts from public.users table
DELETE FROM users 
WHERE email IN (
  'customer@gmail.com',
  'customer1@gmail.com',
  'customer2@gmail.com',
  'vendor@gmail.com',
  'vendor1@gmail.com'
);

-- Step 2: Delete from auth.users table (Supabase authentication)
-- Note: You need to do this in Supabase Dashboard → Authentication → Users
-- Or use this SQL if you have admin access:

-- For Supabase, delete from auth schema:
DELETE FROM auth.users 
WHERE email IN (
  'customer@gmail.com',
  'customer1@gmail.com', 
  'customer2@gmail.com',
  'vendor@gmail.com',
  'vendor1@gmail.com'
);

-- Step 3: Clean up related data (profiles, etc.)
DELETE FROM user_profiles 
WHERE user_id NOT IN (SELECT id FROM users);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check remaining users
SELECT 
  email,
  role,
  status,
  created_at
FROM users
ORDER BY created_at DESC;

-- Success message
SELECT 'Test accounts deleted! ✅' as status;

-- =====================================================
-- ALTERNATIVE: Delete via Supabase Dashboard
-- =====================================================
-- If SQL doesn't work, delete manually:
-- 1. Go to Supabase Dashboard
-- 2. Click "Authentication" in sidebar
-- 3. Click "Users" tab
-- 4. Find customer@gmail.com, customer1@gmail.com, etc.
-- 5. Click the three dots (⋯) next to each user
-- 6. Click "Delete User"
-- 7. Confirm deletion
