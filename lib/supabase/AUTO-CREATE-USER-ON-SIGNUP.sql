-- ============================================
-- AUTO-SYNC USERS FROM AUTH TO PUBLIC TABLES
-- ============================================
-- This script:
-- 1. Syncs ALL existing users from auth.users to public.users
-- 2. Creates trigger for future signups
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🚀 Starting user sync process...';
  RAISE NOTICE '';
END $$;

-- ============================================
-- STEP 1: Create tables if they don't exist
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STEP 2: Sync existing auth.users to public.users
-- ============================================

-- Insert users that don't exist in public.users yet
INSERT INTO public.users (id, email, role, status, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'customer') as role,
  'active' as status,
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Insert user profiles that don't exist yet
INSERT INTO public.user_profiles (user_id, full_name, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- STEP 3: Create trigger for future signups
-- ============================================

-- Create or update the function that handles new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (
    id,
    email,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    'active',
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (
    user_id,
    full_name,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    '',
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 4: Success message
-- ============================================

DO $$
DECLARE
  user_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔═══════════════════════════════════════════════╗';
  RAISE NOTICE '║   ✅ USER SYNC COMPLETED SUCCESSFULLY! ✅    ║';
  RAISE NOTICE '╚═══════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📊 SYNC RESULTS:';
  RAISE NOTICE '   - Total users synced: %', user_count;
  RAISE NOTICE '   - Total profiles created: %', profile_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 WHAT HAPPENED:';
  RAISE NOTICE '   ✅ All existing auth users copied to public.users';
  RAISE NOTICE '   ✅ All user profiles created';
  RAISE NOTICE '   ✅ Trigger installed for future signups';
  RAISE NOTICE '';
  RAISE NOTICE '📋 FROM NOW ON:';
  RAISE NOTICE '   - Every new signup → auto-added to admin panel';
  RAISE NOTICE '   - Role (customer/vendor) → auto-detected';
  RAISE NOTICE '   - Status → automatically set to active';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Admin can now see ALL users in User Management!';
  RAISE NOTICE '';
END $$;
