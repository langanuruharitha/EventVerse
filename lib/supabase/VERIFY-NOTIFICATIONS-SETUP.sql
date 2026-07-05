-- =====================================================
-- VERIFY ADMIN NOTIFICATIONS SETUP
-- =====================================================
-- Run this to check if notifications system is working

-- Check 1: Does the table exist?
SELECT 
  '✅ Table exists' as status,
  COUNT(*) as notification_count
FROM admin_notifications;

-- Check 2: Show all notifications (if any)
SELECT 
  id,
  type,
  title,
  user_email,
  user_name,
  user_role,
  is_read,
  created_at
FROM admin_notifications
ORDER BY created_at DESC
LIMIT 10;

-- Check 3: Count by type
SELECT 
  type,
  COUNT(*) as count,
  COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count
FROM admin_notifications
GROUP BY type;

-- Check 4: Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'admin_notifications';

-- Check 5: Recent activity (last 24 hours)
SELECT 
  COUNT(*) as notifications_last_24h,
  COUNT(CASE WHEN type = 'signup' THEN 1 END) as signups,
  COUNT(CASE WHEN type = 'login' THEN 1 END) as logins
FROM admin_notifications
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Check 6: Verify indexes exist
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'admin_notifications';

SELECT '✅ All checks complete!' as final_status;
