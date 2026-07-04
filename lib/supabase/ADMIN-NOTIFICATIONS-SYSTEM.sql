-- =====================================================
-- ADMIN NOTIFICATIONS SYSTEM
-- =====================================================
-- This creates a notification system for admin to see new signups
-- and sends email alerts when vendors/customers register

-- Step 1: Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'new_vendor', 'new_customer', 'vendor_verified', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_type TEXT, -- 'vendor' or 'customer'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Step 3: RLS Policy - Only admins can see notifications
CREATE POLICY "Admins can view all notifications"
ON admin_notifications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 4: RLS Policy - System can insert notifications
CREATE POLICY "System can create notifications"
ON admin_notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: RLS Policy - Admins can update notifications (mark as read)
CREATE POLICY "Admins can update notifications"
ON admin_notifications FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 6: Create function to send notification on new user signup
CREATE OR REPLACE FUNCTION notify_admin_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  user_type_text TEXT;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Determine user type from users table
  SELECT role INTO user_type_text
  FROM users
  WHERE id = NEW.id;

  -- Only notify for vendors and customers, not admins
  IF user_type_text IN ('vendor', 'customer') THEN
    -- Create notification title and message
    IF user_type_text = 'vendor' THEN
      notification_title := '🏪 New Vendor Registration';
      notification_message := 'A new vendor has signed up: ' || COALESCE(NEW.email, 'Unknown');
    ELSE
      notification_title := '👤 New Customer Registration';
      notification_message := 'A new customer has signed up: ' || COALESCE(NEW.email, 'Unknown');
    END IF;

    -- Insert notification
    INSERT INTO admin_notifications (
      type,
      title,
      message,
      user_id,
      user_email,
      user_type,
      is_read
    ) VALUES (
      'new_' || user_type_text,
      notification_title,
      notification_message,
      NEW.id,
      NEW.email,
      user_type_text,
      false
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger on users table
DROP TRIGGER IF EXISTS on_user_created_notify_admin ON users;
CREATE TRIGGER on_user_created_notify_admin
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION notify_admin_on_signup();

-- Step 8: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);

-- Step 9: Email notification function (requires Supabase Edge Function or external service)
-- Note: This creates the schema. You'll need to set up email service separately.
CREATE TABLE IF NOT EXISTS admin_email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  notify_on_vendor_signup BOOLEAN DEFAULT true,
  notify_on_customer_signup BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin email
INSERT INTO admin_email_settings (admin_email)
VALUES ('harithalanganuru@gmail.com')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if table exists
SELECT 'admin_notifications table created' as status
WHERE EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'admin_notifications'
);

-- Check trigger exists
SELECT 'Trigger created successfully' as status
WHERE EXISTS (
  SELECT FROM pg_trigger 
  WHERE tgname = 'on_user_created_notify_admin'
);
