-- ============================================
-- AUTO-CREATE USER RECORD ON SIGNUP
-- ============================================
-- This trigger automatically creates a user record in the public.users table
-- when someone signs up via Supabase Auth
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
    NOW(),
    NOW()
  );

  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (
    user_id,
    full_name,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    '',
    NOW(),
    NOW()
  );

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

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Auto-create user trigger installed!';
  RAISE NOTICE '📋 When anyone signs up:';
  RAISE NOTICE '   - User record created in public.users table';
  RAISE NOTICE '   - User profile created in user_profiles table';
  RAISE NOTICE '   - Role (customer/vendor) automatically set';
  RAISE NOTICE '   - Status automatically set to active';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Admin can now see ALL users (past and future) in User Management!';
END $$;
