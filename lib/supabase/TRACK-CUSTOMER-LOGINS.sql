-- =====================================================
-- TRACK CUSTOMER & VENDOR LOGINS
-- =====================================================
-- This creates notifications when customers/vendors login

-- Step 1: Create login tracking table
CREATE TABLE IF NOT EXISTS user_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_role TEXT,
  login_time TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Step 2: Enable RLS on login history
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;

-- Step 3: Policy - Admins can view all login history
CREATE POLICY "Admins can view login history"
ON user_login_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 4: Policy - System can insert login records
CREATE POLICY "System can insert login history"
ON user_login_history FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: Create function to log user login
CREATE OR REPLACE FUNCTION log_user_login()
RETURNS void AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
  current_user_role TEXT;
BEGIN
  -- Get current authenticated user
  SELECT auth.uid() INTO current_user_id;
  
  IF current_user_id IS NOT NULL THEN
    -- Get user details
    SELECT email, role INTO current_user_email, current_user_role
    FROM users
    WHERE id = current_user_id;
    
    -- Only track customers and vendors, not admins
    IF current_user_role IN ('customer', 'vendor') THEN
      -- Insert login record
      INSERT INTO user_login_history (user_id, user_email, user_role)
      VALUES (current_user_id, current_user_email, current_user_role);
      
      -- Create notification for admin
      INSERT INTO admin_notifications (
        type,
        title,
        message,
        user_id,
        user_email,
        user_type,
        is_read
      ) VALUES (
        current_user_role || '_login',
        CASE 
          WHEN current_user_role = 'vendor' THEN '🏪 Vendor Login'
          ELSE '👤 Customer Login'
        END,
        CASE 
          WHEN current_user_role = 'vendor' THEN 'Vendor logged in: ' || current_user_email
          ELSE 'Customer logged in: ' || current_user_email
        END,
        current_user_id,
        current_user_email,
        current_user_role,
        false
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_login_history_user ON user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_time ON user_login_history(login_time DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_role ON user_login_history(user_role);

-- Step 7: Update notification types to include logins
COMMENT ON TABLE user_login_history IS 'Tracks every time a customer or vendor logs in';
COMMENT ON TABLE admin_notifications IS 'Admin notifications for signups and logins';

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================
-- Call this function from your login/auth callback code:
-- SELECT log_user_login();
-- 
-- This will:
-- 1. Record the login in user_login_history table
-- 2. Create a notification in admin_notifications
-- 3. Admin will see it in /admin/notifications

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 'Login tracking system created! ✅' as status;

-- To manually test (run after logging in):
-- SELECT log_user_login();
