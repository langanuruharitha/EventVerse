-- =====================================================
-- TEST: Manually Insert a Notification
-- =====================================================
-- This will help verify if the notification system is working

-- Insert a test notification
INSERT INTO admin_notifications (
  type,
  title,
  message,
  user_email,
  user_name,
  user_role,
  is_read,
  created_at
) VALUES (
  'login',
  '👤 TEST: User Login Notification - EventVerse',
  'Hello Admin,

This is a TEST notification to verify the system is working.

📋 Login Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: Test User
• Email: test@example.com
• Role: Customer
• Time: ' || NOW()::text || '

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
EventVerse System',
  'test@example.com',
  'Test User',
  'customer',
  false,
  NOW()
);

-- Verify it was inserted
SELECT 
  id,
  type,
  user_email,
  user_name,
  created_at,
  '✅ Test notification created!' as status
FROM admin_notifications
ORDER BY created_at DESC
LIMIT 1;

-- Show count
SELECT COUNT(*) as total_notifications FROM admin_notifications;

SELECT '✅ Now go to /admin/notifications to see this test notification!' as next_step;
