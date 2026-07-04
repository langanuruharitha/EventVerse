-- ============================================
-- FIX ADMIN ACCESS ERROR
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create admin_users table (if not exists)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{
        "manage_vendors": true,
        "manage_users": true,
        "manage_templates": true,
        "manage_support": true,
        "manage_analytics": true,
        "manage_settings": true
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Step 3: Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies (if any)
DROP POLICY IF EXISTS "Admins can read own data" ON admin_users;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update own data" ON admin_users;

-- Step 5: Create RLS policies
-- Allow admins to read their own data
CREATE POLICY "Admins can read own data"
ON admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow authenticated users to check if they're admin (for setup)
CREATE POLICY "Users can check admin status"
ON admin_users
FOR SELECT
TO authenticated
USING (true);

-- Allow updates to own record
CREATE POLICY "Admins can update own data"
ON admin_users
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Step 6: Create function to grant admin access
CREATE OR REPLACE FUNCTION grant_admin_access(
    user_email TEXT,
    admin_role TEXT DEFAULT 'admin'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
    result JSON;
BEGIN
    -- Find user by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = user_email;

    IF target_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found with email: ' || user_email
        );
    END IF;

    -- Insert or update admin record
    INSERT INTO admin_users (user_id, email, full_name, role, is_active, permissions)
    SELECT 
        target_user_id,
        user_email,
        COALESCE(raw_user_meta_data->>'full_name', user_email),
        admin_role,
        true,
        CASE 
            WHEN admin_role = 'super_admin' THEN '{
                "manage_vendors": true,
                "manage_users": true,
                "manage_templates": true,
                "manage_support": true,
                "manage_analytics": true,
                "manage_settings": true,
                "manage_admins": true
            }'::jsonb
            ELSE '{
                "manage_vendors": true,
                "manage_users": true,
                "manage_templates": true,
                "manage_support": true,
                "manage_analytics": true,
                "manage_settings": false
            }'::jsonb
        END
    FROM auth.users
    WHERE id = target_user_id
    ON CONFLICT (user_id) 
    DO UPDATE SET
        role = admin_role,
        is_active = true,
        updated_at = now();

    RETURN json_build_object(
        'success', true,
        'message', 'Admin access granted to ' || user_email,
        'role', admin_role
    );
END;
$$;

-- ============================================
-- NOW: CREATE YOUR ADMIN USER
-- ============================================

-- OPTION 1: If you know your email, replace below and run
-- REPLACE 'YOUR_EMAIL_HERE' with your actual email!

DO $$
DECLARE
    my_email TEXT := 'YOUR_EMAIL_HERE';  -- ← CHANGE THIS!
    result JSON;
BEGIN
    -- Check if email exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = my_email) THEN
        RAISE NOTICE '❌ ERROR: User with email % not found!', my_email;
        RAISE NOTICE '📝 Action needed: Sign up first at /auth/signup';
    ELSE
        -- Grant admin access
        SELECT grant_admin_access(my_email, 'super_admin') INTO result;
        RAISE NOTICE '✅ Result: %', result;
    END IF;
END $$;

-- ============================================
-- OPTION 2: Make FIRST user an admin (auto-detect)
-- ============================================

-- Uncomment below if you want the first registered user to become admin
/*
INSERT INTO admin_users (user_id, email, full_name, role, is_active)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email),
    'super_admin',
    true
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id) DO UPDATE
SET is_active = true, role = 'super_admin';
*/

-- ============================================
-- OPTION 3: Make ALL current users admins
-- ============================================

-- Uncomment below if you want all existing users to be admins
/*
INSERT INTO admin_users (user_id, email, full_name, role, is_active)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email),
    'admin',
    true
FROM auth.users
ON CONFLICT (user_id) DO UPDATE
SET is_active = true;
*/

-- ============================================
-- VERIFY IT WORKED
-- ============================================

-- Check all admin users
SELECT 
    au.id,
    au.email,
    au.full_name,
    au.role,
    au.is_active,
    au.created_at,
    u.email as auth_email,
    u.created_at as user_created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at DESC;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '✅ Admin Access Setup Complete!';
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 What was created:';
    RAISE NOTICE '  ✓ admin_users table';
    RAISE NOTICE '  ✓ RLS policies';
    RAISE NOTICE '  ✓ grant_admin_access() function';
    RAISE NOTICE '  ✓ Indexes for performance';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next steps:';
    RAISE NOTICE '  1. Check the SELECT query above for your admin user';
    RAISE NOTICE '  2. Go to http://localhost:3000/admin/login';
    RAISE NOTICE '  3. Login with your email and password';
    RAISE NOTICE '  4. Access the admin dashboard!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  If you see "0 rows" above:';
    RAISE NOTICE '  → Replace YOUR_EMAIL_HERE in this script';
    RAISE NOTICE '  → OR go to /admin/setup page';
    RAISE NOTICE '  → OR uncomment OPTION 2 or OPTION 3 above';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If you see "0 rows" in the verify query:
-- 1. Check all users in auth:
-- SELECT id, email, created_at FROM auth.users;

-- 2. Copy your email and run:
-- SELECT grant_admin_access('your-email@example.com', 'super_admin');

-- 3. Verify again:
-- SELECT * FROM admin_users WHERE email = 'your-email@example.com';
