-- Check vendor_profiles table schema
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'vendor_profiles'
ORDER BY ordinal_position;

-- Check if vendor profile exists for this user
SELECT 
  vp.*
FROM vendor_profiles vp
JOIN auth.users au ON au.id = vp.user_id
WHERE au.email = '24091a31f05@mitic.ac.in';
