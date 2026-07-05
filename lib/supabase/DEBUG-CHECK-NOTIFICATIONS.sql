-- =====================================================
-- DEBUG: Check Why Notifications Not Working
-- =====================================================

-- Check 1: Does the table exist?
SELECT 
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_notifications'
  ) as table_exists;

-- Check 2: Are there any notifications in the table?
SELECT COUNT(*) as total_notifications FROM admin_notifications;

-- Check 3: Show all notifications (even if empty)
SELECT 
  id,
  type,
  user_email,
  user_name,
  user_role,
  created_at,
  is_read
FROM admin_notifications
ORDER BY created_at DESC
LIMIT 10;

-- Check 4: Who is admin?
SELECT 
  email,
  role,
  '✅' as is_admin
FROM users
WHERE role = 'admin';

-- Check 5: Check recent logins (from auth logs)
SELECT 
  u.email,
  u.role,
  'Should trigger notification' as note
FROM users u
WHERE u.role IN ('customer', 'vendor')
ORDER BY u.created_at DESC
LIMIT 5;

SELECT '✅ Diagnostic complete' as status;
