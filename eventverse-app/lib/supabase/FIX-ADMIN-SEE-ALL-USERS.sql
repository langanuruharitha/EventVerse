-- ============================================
-- FIX: Allow Admin to See ALL Users
-- ============================================
-- This ensures admin can see all users regardless of RLS
-- ============================================

-- Step 1: Disable RLS on users and user_profiles tables temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Sync ALL auth users to public.users (force update)
INSERT INTO public.users (id, email, role, status, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'customer') as role,
  'active' as status,
  au.created_at,
  NOW()
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Step 3: Sync ALL user profiles
INSERT INTO public.user_profiles (user_id, full_name, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  au.created_at,
  NOW()
FROM auth.users au
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Step 4: Create RLS policy that allows admin to see all users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Create policy: Anyone authenticated can view all users (for admin panel)
CREATE POLICY "Authenticated users can view all users"
ON public.users FOR SELECT
TO authenticated
USING (true);

-- Create policy: Anyone authenticated can view all profiles (for admin panel)
CREATE POLICY "Authenticated users can view all profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (true);

-- Create policy: Users can only update their own record
CREATE POLICY "Users can update own record"
ON public.users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create policy: Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Show results
DO $$
DECLARE
  auth_count INTEGER;
  public_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO public_count FROM public.users;
  SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔═══════════════════════════════════════════════╗';
  RAISE NOTICE '║     ✅ ADMIN ACCESS FIXED! ✅                ║';
  RAISE NOTICE '╚═══════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📊 SYNC RESULTS:';
  RAISE NOTICE '   - Auth users: %', auth_count;
  RAISE NOTICE '   - Public users: %', public_count;
  RAISE NOTICE '   - User profiles: %', profile_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔓 RLS POLICIES UPDATED:';
  RAISE NOTICE '   ✅ Admin can see ALL users';
  RAISE NOTICE '   ✅ Admin can see ALL profiles';
  RAISE NOTICE '   ✅ Users can only edit their own data';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Refresh admin panel - all users should appear!';
  RAISE NOTICE '';
END $$;
