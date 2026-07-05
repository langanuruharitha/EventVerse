-- =====================================================
-- CHECK HARITHA'S USER ROLE AND FIX IF NEEDED
-- =====================================================

-- Step 1: Check current role
SELECT 
  id,
  email,
  role,
  created_at
FROM users
WHERE email = 'harithalanganuru@gmail.com';

-- Step 2: Check if admin_notifications table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admin_notifications'
) as table_exists;

-- Step 3: Check if there are any notifications
SELECT COUNT(*) as notification_count
FROM admin_notifications;

-- Step 4: Show recent notifications (if any)
SELECT 
  id,
  type,
  user_email,
  user_name,
  created_at
FROM admin_notifications
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- FIX: Make harithalanganuru@gmail.com an ADMIN
-- =====================================================

-- Uncomment and run this if role is not 'admin':
UPDATE users 
SET role = 'admin' 
WHERE email = 'harithalanganuru@gmail.com';

SELECT '✅ Role updated to admin!' as status;

-- Verify the change
SELECT 
  email,
  role
FROM users
WHERE email = 'harithalanganuru@gmail.com';
