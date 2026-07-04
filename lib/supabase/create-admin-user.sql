-- ====================================
-- CREATE ADMIN USER
-- ====================================
-- This script creates an admin user account
-- Run this in Supabase SQL Editor to grant admin access

-- Step 1: First, create a regular auth user (if not exists)
-- You can do this through Supabase Dashboard > Authentication > Users
-- Or run this SQL:

-- Example: Create auth user (REPLACE with actual email and password)
-- INSERT INTO auth.users (
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   created_at,
--   updated_at
-- ) VALUES (
--   'admin@eventverse.com',
--   crypt('your_password_here', gen_salt('bf')),
--   NOW(),
--   '{"provider":"email","providers":["email"]}',
--   '{"full_name":"Admin User"}',
--   NOW(),
--   NOW()
-- );

-- Step 2: Get the user_id from the auth.users table
-- SELECT id, email FROM auth.users WHERE email = 'admin@eventverse.com';

-- Step 3: Insert into admin_users table
-- REPLACE 'USER_ID_HERE' with the actual user_id from Step 2

INSERT INTO admin_users (
  user_id,
  role,
  permissions,
  full_name,
  email,
  phone,
  is_active,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE',  -- Replace with actual user_id
  'super_admin',   -- Options: 'super_admin', 'admin', 'moderator', 'support'
  jsonb_build_object(
    'manage_vendors', true,
    'manage_users', true,
    'manage_templates', true,
    'manage_support', true,
    'manage_analytics', true,
    'manage_settings', true,
    'manage_admins', true
  ),
  'Admin User',
  'admin@eventverse.com',
  '+1234567890',
  true,
  NOW(),
  NOW()
);

-- ====================================
-- QUICK METHOD: Grant Admin Access to Existing User
-- ====================================
-- If the user already exists in auth.users, use this:

-- Replace 'user@example.com' with the actual email
INSERT INTO admin_users (
  user_id,
  role,
  permissions,
  full_name,
  email,
  is_active
)
SELECT 
  id as user_id,
  'super_admin' as role,
  jsonb_build_object(
    'manage_vendors', true,
    'manage_users', true,
    'manage_templates', true,
    'manage_support', true,
    'manage_analytics', true,
    'manage_settings', true,
    'manage_admins', true
  ) as permissions,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User') as full_name,
  email,
  true as is_active
FROM auth.users
WHERE email = 'admin@eventverse.com'  -- REPLACE WITH ACTUAL EMAIL
ON CONFLICT (user_id) DO NOTHING;

-- ====================================
-- VERIFY ADMIN ACCESS
-- ====================================
-- Check if admin user was created successfully
SELECT 
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'admin@eventverse.com';  -- REPLACE WITH ACTUAL EMAIL

-- ====================================
-- REMOVE ADMIN ACCESS (if needed)
-- ====================================
-- To revoke admin access:
-- DELETE FROM admin_users WHERE email = 'admin@eventverse.com';

-- Or just deactivate:
-- UPDATE admin_users SET is_active = false WHERE email = 'admin@eventverse.com';
