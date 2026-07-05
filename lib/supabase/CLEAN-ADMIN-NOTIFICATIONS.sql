-- =====================================================
-- CLEAN & RECREATE ADMIN NOTIFICATIONS
-- =====================================================
-- Use this if you want to start fresh

-- Drop all policies
DROP POLICY IF EXISTS "Admins can view their notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can update their notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON admin_notifications;

-- Drop all indexes
DROP INDEX IF EXISTS idx_admin_notifications_admin;
DROP INDEX IF EXISTS idx_admin_notifications_unread;
DROP INDEX IF EXISTS idx_admin_notifications_type;
DROP INDEX IF EXISTS idx_admin_notifications_created;

-- Drop the table
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- Success
SELECT '✅ Cleaned up admin_notifications table!' as status;
SELECT 'Now run CREATE-ADMIN-NOTIFICATIONS.sql to recreate it' as next_step;
