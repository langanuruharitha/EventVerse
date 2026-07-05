-- =====================================================
-- FORCE DELETE TEST USERS WITH ALL THEIR DATA
-- =====================================================
-- This removes test users and all their related data safely

-- Step 1: Get the user IDs for test accounts
-- Run this first to see what will be deleted:
SELECT id, email, role 
FROM users 
WHERE email IN (
  'customer@gmail.com',
  'customer1@gmail.com',
  'customer2@gmail.com',
  'vendor@gmail.com',
  'vendor1@gmail.com'
);

-- Step 2: Delete all related data for these users
-- This prevents foreign key constraint errors

-- Delete events and all cascade data (guests, budgets, tasks, etc.)
DELETE FROM events 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN (
    'customer@gmail.com',
    'customer1@gmail.com',
    'customer2@gmail.com',
    'vendor@gmail.com',
    'vendor1@gmail.com'
  )
);

-- Delete user profiles
DELETE FROM user_profiles 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN (
    'customer@gmail.com',
    'customer1@gmail.com',
    'customer2@gmail.com',
    'vendor@gmail.com',
    'vendor1@gmail.com'
  )
);

-- Delete vendors (if any)
DELETE FROM vendors 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN (
    'customer@gmail.com',
    'customer1@gmail.com',
    'customer2@gmail.com',
    'vendor@gmail.com',
    'vendor1@gmail.com'
  )
);

-- Step 3: Delete from public.users table
DELETE FROM users 
WHERE email IN (
  'customer@gmail.com',
  'customer1@gmail.com',
  'customer2@gmail.com',
  'vendor@gmail.com',
  'vendor1@gmail.com'
);

-- Step 4: Delete from auth.users table (Supabase authentication)
-- This requires admin service role - run separately if needed
DELETE FROM auth.users 
WHERE email IN (
  'customer@gmail.com',
  'customer1@gmail.com',
  'customer2@gmail.com',
  'vendor@gmail.com',
  'vendor1@gmail.com'
);

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

-- Count remaining users
SELECT 
  role,
  COUNT(*) as count
FROM users
GROUP BY role;

-- Success message
SELECT 'Test users and their data deleted! ✅' as status;
