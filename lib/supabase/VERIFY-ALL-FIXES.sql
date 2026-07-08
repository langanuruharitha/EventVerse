-- =====================================================
-- COMPREHENSIVE VERIFICATION QUERIES
-- Run this AFTER running RUN-THIS-NOW.sql
-- =====================================================

-- Check if user_id is nullable in venue_inquiries
SELECT 
  '1. venue_inquiries.user_id nullable?' as check_name,
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ YES - Anonymous users can submit'
    ELSE '❌ NO - Still requires user_id (RUN SQL FIX!)'
  END as status
FROM information_schema.columns 
WHERE table_name = 'venue_inquiries' 
  AND column_name = 'user_id';

-- Check RLS is enabled for both tables
SELECT 
  '2. RLS Status' as check_name,
  tablename as table_name,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables 
WHERE tablename IN ('venue_inquiries', 'product_reviews')
ORDER BY tablename;

-- Count RLS policies
SELECT 
  '3. RLS Policies Count' as check_name,
  tablename as table_name,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policy_names
FROM pg_policies
WHERE tablename IN ('venue_inquiries', 'product_reviews')
GROUP BY tablename
ORDER BY tablename;

-- Check for anon role policies
SELECT 
  '4. Anonymous User Policies' as check_name,
  tablename as table_name,
  policyname,
  cmd as command_type,
  CASE 
    WHEN roles::text LIKE '%anon%' THEN '✅ Has anon role'
    WHEN roles::text = '{public}' THEN '✅ Public (includes anon)'
    ELSE '⚠️ Check roles: ' || roles::text
  END as anon_access
FROM pg_policies
WHERE tablename = 'venue_inquiries'
  AND cmd = 'INSERT';

-- Count data in tables
SELECT 
  '5. Data Counts' as check_name,
  'venue_inquiries' as table_name,
  COUNT(*) as row_count,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as anonymous_inquiries,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as logged_in_inquiries
FROM venue_inquiries
UNION ALL
SELECT 
  '5. Data Counts' as check_name,
  'product_reviews' as table_name,
  COUNT(*) as row_count,
  COUNT(CASE WHEN is_approved THEN 1 END) as approved_reviews,
  COUNT(CASE WHEN NOT is_approved THEN 1 END) as pending_reviews
FROM product_reviews
UNION ALL
SELECT 
  '5. Data Counts' as check_name,
  'venue_reviews' as table_name,
  COUNT(*) as row_count,
  COUNT(CASE WHEN is_approved THEN 1 END) as approved_reviews,
  COUNT(CASE WHEN NOT is_approved THEN 1 END) as pending_reviews
FROM venue_reviews;

-- Sample recent venue inquiries
SELECT 
  '6. Recent Venue Inquiries (Last 5)' as check_name,
  id,
  full_name,
  email,
  CASE 
    WHEN user_id IS NULL THEN '👤 Anonymous'
    ELSE '🔐 Logged In'
  END as user_type,
  status,
  created_at
FROM venue_inquiries
ORDER BY created_at DESC
LIMIT 5;

-- Check grants to anon role
SELECT 
  '7. Anon Role Permissions' as check_name,
  table_name,
  privilege_type,
  CASE 
    WHEN privilege_type = 'INSERT' THEN '✅ Can insert'
    WHEN privilege_type = 'SELECT' THEN '✅ Can select'
    ELSE privilege_type
  END as permission_status
FROM information_schema.role_table_grants
WHERE grantee = 'anon'
  AND table_name IN ('venue_inquiries', 'product_reviews')
ORDER BY table_name, privilege_type;

-- Overall Status Summary
SELECT 
  '8. OVERALL STATUS' as summary,
  CASE 
    WHEN (
      -- Check user_id is nullable
      EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'venue_inquiries' 
          AND column_name = 'user_id' 
          AND is_nullable = 'YES'
      )
      -- Check anon insert policy exists
      AND EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'venue_inquiries' 
          AND cmd = 'INSERT'
          AND (roles LIKE '%anon%' OR roles = '{public}')
      )
      -- Check RLS is enabled
      AND EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'venue_inquiries' 
          AND rowsecurity = true
      )
    ) 
    THEN '✅ ALL CHECKS PASSED - Ready to test!'
    ELSE '❌ SOME CHECKS FAILED - Review details above'
  END as status;

-- Show detailed policy definitions
SELECT 
  '9. Detailed Policy Definitions' as check_name,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename IN ('venue_inquiries', 'product_reviews')
ORDER BY tablename, policyname;
