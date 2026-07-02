-- ====================================
-- GRANT ADMIN ACCESS FUNCTION
-- ====================================
-- This function allows granting admin access to any user
-- Run this in Supabase SQL Editor

-- Create the function
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
  user_full_name TEXT;
  result JSON;
BEGIN
  -- Get user ID from auth.users
  SELECT id, raw_user_meta_data->>'full_name'
  INTO target_user_id, user_full_name
  FROM auth.users
  WHERE email = user_email;

  -- Check if user exists
  IF target_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found. Please ensure the user has signed up first.'
    );
  END IF;

  -- Check if already admin
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = target_user_id) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User already has admin access'
    );
  END IF;

  -- Insert into admin_users
  INSERT INTO admin_users (
    user_id,
    role,
    permissions,
    full_name,
    email,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    target_user_id,
    admin_role,
    CASE 
      WHEN admin_role = 'super_admin' THEN
        jsonb_build_object(
          'manage_vendors', true,
          'manage_users', true,
          'manage_templates', true,
          'manage_support', true,
          'manage_analytics', true,
          'manage_settings', true,
          'manage_admins', true
        )
      WHEN admin_role = 'admin' THEN
        jsonb_build_object(
          'manage_vendors', true,
          'manage_users', true,
          'manage_templates', true,
          'manage_support', true,
          'manage_analytics', true,
          'manage_settings', false,
          'manage_admins', false
        )
      WHEN admin_role = 'moderator' THEN
        jsonb_build_object(
          'manage_vendors', false,
          'manage_users', false,
          'manage_templates', false,
          'manage_support', true,
          'manage_analytics', false,
          'manage_settings', false,
          'manage_admins', false
        )
      ELSE
        jsonb_build_object(
          'manage_vendors', false,
          'manage_users', false,
          'manage_templates', false,
          'manage_support', true,
          'manage_analytics', false,
          'manage_settings', false,
          'manage_admins', false
        )
    END,
    COALESCE(user_full_name, 'Admin User'),
    user_email,
    true,
    NOW(),
    NOW()
  );

  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'Admin access granted successfully',
    'user_id', target_user_id,
    'email', user_email,
    'role', admin_role
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
-- IMPORTANT: In production, restrict this to super admins only!
GRANT EXECUTE ON FUNCTION grant_admin_access(TEXT, TEXT) TO authenticated;

-- ====================================
-- TEST THE FUNCTION
-- ====================================
-- Test granting admin access
-- SELECT grant_admin_access('user@example.com', 'super_admin');

-- ====================================
-- REVOKE ADMIN ACCESS FUNCTION (Optional)
-- ====================================
CREATE OR REPLACE FUNCTION revoke_admin_access(
  user_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from admin_users
  DELETE FROM admin_users WHERE email = user_email;

  IF FOUND THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Admin access revoked successfully'
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'Admin user not found'
    );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION revoke_admin_access(TEXT) TO authenticated;

-- ====================================
-- USAGE EXAMPLES
-- ====================================

-- Grant super admin access
-- SELECT grant_admin_access('admin@eventverse.com', 'super_admin');

-- Grant regular admin access
-- SELECT grant_admin_access('staff@eventverse.com', 'admin');

-- Grant moderator access
-- SELECT grant_admin_access('mod@eventverse.com', 'moderator');

-- Grant support access
-- SELECT grant_admin_access('support@eventverse.com', 'support');

-- Revoke admin access
-- SELECT revoke_admin_access('user@example.com');

-- Check admin users
-- SELECT * FROM admin_users;
