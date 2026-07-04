-- ============================================
-- GRANT ADMIN ACCESS TO: testkarlsapur@gmail.com
-- Generated from Debug Tool
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
        "manage_settings": true,
        "manage_admins": true
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
DROP POLICY IF EXISTS "Admins can read own data" ON admin_users;
CREATE POLICY "Admins can read own data"
ON admin_users FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can check admin status" ON admin_users;
CREATE POLICY "Users can check admin status"
ON admin_users FOR SELECT TO authenticated
USING (true);

-- Step 4: Grant admin access to YOUR user
INSERT INTO admin_users (user_id, email, full_name, role, is_active, permissions)
VALUES (
    '66a45da6-f991-4f3c-8fa1-7a91c628c1fc'::uuid,  -- Your user_id from debug tool
    'testkarlsapur@gmail.com',                      -- Your email
    'Test Karlsapur',                               -- Full name (change if needed)
    'super_admin',                                  -- Role
    true,                                           -- Active status
    '{
        "manage_vendors": true,
        "manage_users": true,
        "manage_templates": true,
        "manage_support": true,
        "manage_analytics": true,
        "manage_settings": true,
        "manage_admins": true
    }'::jsonb
)
ON CONFLICT (user_id) DO UPDATE
SET 
    is_active = true,
    role = 'super_admin',
    updated_at = now();

-- Step 5: Verify it worked
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.full_name,
    au.role,
    au.is_active,
    au.created_at,
    u.email as auth_email
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.user_id = '66a45da6-f991-4f3c-8fa1-7a91c628c1fc'::uuid;

-- ============================================
-- SUCCESS!
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '✅ Admin Access Granted!';
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '👤 User: testkarlsapur@gmail.com';
    RAISE NOTICE '🔑 Role: super_admin';
    RAISE NOTICE '📋 User ID: 66a45da6-f991-4f3c-8fa1-7a91c628c1fc';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '  1. Check the SELECT query above';
    RAISE NOTICE '  2. Refresh the debug page';
    RAISE NOTICE '  3. Go to http://localhost:3000/admin/login';
    RAISE NOTICE '  4. Login with testkarlsapur@gmail.com';
    RAISE NOTICE '  5. Access the admin dashboard!';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;
