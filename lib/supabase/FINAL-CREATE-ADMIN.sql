-- ====================================
-- FINAL ADMIN SETUP - COMPLETE
-- ====================================
-- Run this entire script in Supabase SQL Editor

-- Step 1: Drop table if exists (clean start)
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Step 2: Create admin_users table with ALL columns
CREATE TABLE admin_users (
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
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- Step 4: Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
CREATE POLICY "Admins can view all admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Super admins can manage admins"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

-- Step 6: Create admin activity logs table
CREATE TABLE admin_activity_logs (
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

CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- ====================================
-- Step 7: GRANT ADMIN ACCESS
-- ====================================
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual UUID
-- Get your UUID from: Supabase Dashboard > Authentication > Users > Click your email > Copy UID

INSERT INTO admin_users (
  user_id,
  role,
  permissions,
  full_name,
  email,
  is_active
) VALUES (
  '46d6854d-2724-4ba1-9f1a-f3c73f9d54c5',  -- ← REPLACE WITH YOUR UUID FROM SUPABASE
  'super_admin',
  '{"manage_vendors":true,"manage_users":true,"manage_templates":true,"manage_support":true,"manage_analytics":true,"manage_settings":true,"manage_admins":true}'::jsonb,
  'Haritha',
  'harithalanganuru@gmail.com',
  true
);

-- ====================================
-- Step 8: VERIFY
-- ====================================
-- Run this to confirm admin access was granted
SELECT 
  id,
  user_id,
  role,
  full_name,
  email,
  is_active,
  created_at
FROM admin_users
WHERE email = 'harithalanganuru@gmail.com';

-- You should see one row with:
-- role: super_admin
-- is_active: true
-- ====================================
