-- ====================================
-- CREATE ADMIN USERS TABLE
-- ====================================
-- Run this FIRST if admin_users table doesn't exist

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')),
  permissions JSONB DEFAULT '{}'::jsonb,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin users can view all admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage admins"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- Create admin activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  description TEXT NOT NULL,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- ====================================
-- NOW GRANT ADMIN ACCESS
-- ====================================

-- Step 1: Get your user_id
-- SELECT id, email FROM auth.users WHERE email = 'harithalanganuru@gmail.com';

-- Step 2: Grant admin access (REPLACE the user_id below)
-- Run this after getting the user_id from Step 1

-- IMPORTANT: First, sign up at http://localhost:3000/auth/signup
-- Then run this SQL with the correct user_id

-- Example (REPLACE 'YOUR_USER_ID' with actual UUID):
/*
INSERT INTO admin_users (
  user_id,
  role,
  permissions,
  full_name,
  email,
  is_active
) VALUES (
  'YOUR_USER_ID',  -- Get this from: SELECT id FROM auth.users WHERE email = 'harithalanganuru@gmail.com'
  'super_admin',
  '{"manage_vendors":true,"manage_users":true,"manage_templates":true,"manage_support":true,"manage_analytics":true,"manage_settings":true,"manage_admins":true}'::jsonb,
  'Haritha',
  'harithalanganuru@gmail.com',
  true
);
*/

-- ====================================
-- GRANT ADMIN ACCESS - MANUAL METHOD
-- ====================================
-- After signing up, you need to get your user_id first
-- Then manually insert into admin_users

-- Step A: Find your user_id (COPY the result)
-- Go to Supabase Dashboard > Authentication > Users
-- Find your email: harithalanganuru@gmail.com
-- Copy the UUID (it looks like: abc12345-def6-7890-ghij-klmnopqrstuv)

-- Step B: Replace 'YOUR_USER_ID_HERE' below with the UUID you copied
-- Then uncomment and run:

/*
INSERT INTO admin_users (
  user_id,
  role,
  permissions,
  full_name,
  email,
  is_active
) VALUES (
  'YOUR_USER_ID_HERE',  -- PASTE YOUR UUID HERE
  'super_admin',
  '{"manage_vendors":true,"manage_users":true,"manage_templates":true,"manage_support":true,"manage_analytics":true,"manage_settings":true,"manage_admins":true}'::jsonb,
  'Haritha',
  'harithalanganuru@gmail.com',
  true
);
*/

-- ====================================
-- VERIFY AFTER INSERTION
-- ====================================
-- Run this to check if admin access was granted:
-- SELECT * FROM admin_users WHERE email = 'harithalanganuru@gmail.com';
