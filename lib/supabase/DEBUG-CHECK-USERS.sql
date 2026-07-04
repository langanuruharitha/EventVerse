-- ============================================
-- DEBUG: Check Users Table and Sync
-- ============================================

-- Check how many users in auth.users
DO $$
DECLARE
  auth_count INTEGER;
  public_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO public_count FROM public.users;
  
  RAISE NOTICE '📊 USER COUNT CHECK:';
  RAISE NOTICE '   - auth.users table: % users', auth_count;
  RAISE NOTICE '   - public.users table: % users', public_count;
  RAISE NOTICE '';
END $$;

-- Show all users in auth.users
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Show all users in public.users
SELECT 
  id,
  email,
  role,
  status,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- Check RLS policies on users table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users';
