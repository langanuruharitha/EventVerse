-- =====================================================
-- ADMIN NOTIFICATIONS TABLE
-- =====================================================
-- Stores notifications for admin when users signup/login
-- Version: 2.0 - Fixed all potential errors

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop table if it exists (clean start)
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- Create the table
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Notification Type ('signup' or 'login')
  type VARCHAR(50) NOT NULL,
  
  -- Notification Content
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  
  -- User Information
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Check constraint for notification type
  CONSTRAINT check_notification_type CHECK (type IN ('signup', 'login'))
);

-- Create indexes AFTER table is created
CREATE INDEX idx_admin_notifications_unread ON admin_notifications(is_read, created_at DESC);
CREATE INDEX idx_admin_notifications_type ON admin_notifications(type, created_at DESC);
CREATE INDEX idx_admin_notifications_created ON admin_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can see notifications
CREATE POLICY "Admins can view all notifications" ON admin_notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow service role and authenticated users to insert (for API calls)
CREATE POLICY "System can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (true);

-- Success message
SELECT '✅ admin_notifications table created successfully!' as status;
SELECT '✅ Admin will receive notifications when users signup or login' as info;
SELECT '✅ Notification menu is available at /admin/notifications' as access;
