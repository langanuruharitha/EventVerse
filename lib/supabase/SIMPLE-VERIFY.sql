-- =====================================================
-- SIMPLE VERIFICATION - Check if Fix Worked
-- =====================================================

-- 1. Check if user_id is nullable (MOST IMPORTANT)
SELECT 
  'CHECK 1: user_id nullable?' as check_name,
  column_name,
  is_nullable,
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ PASS - Anonymous users can submit'
    ELSE '❌ FAIL - Run RUN-THIS-NOW.sql'
  END as status
FROM information_schema.columns 
WHERE table_name = 'venue_inquiries' 
  AND column_name = 'user_id';

-- 2. Check RLS policies exist for venue_inquiries
SELECT 
  'CHECK 2: RLS Policies' as check_name,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - Policies created'
    ELSE '❌ FAIL - Run RUN-THIS-NOW.sql'
  END as status
FROM pg_policies
WHERE tablename = 'venue_inquiries';

-- 3. Check if anon insert policy exists
SELECT 
  'CHECK 3: Anon Insert Policy' as check_name,
  COUNT(*) as anon_policies,
  CASE 
    WHEN COUNT(*) >= 1 THEN '✅ PASS - Anon can insert'
    ELSE '❌ FAIL - Run RUN-THIS-NOW.sql'
  END as status
FROM pg_policies
WHERE tablename = 'venue_inquiries'
  AND cmd = 'INSERT'
  AND policyname LIKE '%anon%';

-- 4. Count venue inquiries
SELECT 
  'CHECK 4: Venue Inquiries' as check_name,
  COUNT(*) as total_inquiries,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as anonymous_inquiries,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Data exists'
    ELSE '⚠️ No inquiries yet (submit one to test)'
  END as status
FROM venue_inquiries;

-- 5. Count product reviews
SELECT 
  'CHECK 5: Product Reviews' as check_name,
  COUNT(*) as total_reviews,
  CASE 
    WHEN COUNT(*) >= 60 THEN '✅ PASS - All reviews added'
    WHEN COUNT(*) > 0 THEN '⚠️ Some reviews added (' || COUNT(*) || ' of 60)'
    ELSE '❌ FAIL - Run ADD-PRODUCT-REVIEWS.sql'
  END as status
FROM product_reviews;

-- 6. Count venue reviews
SELECT 
  'CHECK 6: Venue Reviews' as check_name,
  COUNT(*) as total_reviews,
  CASE 
    WHEN COUNT(*) >= 25 THEN '✅ PASS - All reviews added'
    WHEN COUNT(*) > 0 THEN '⚠️ Some reviews added (' || COUNT(*) || ' of 25)'
    ELSE '❌ FAIL - Run ADD-VENUE-REVIEWS.sql'
  END as status
FROM venue_reviews;

-- 7. Overall status
SELECT 
  '========================================' as separator;

SELECT 
  '🎯 OVERALL STATUS' as result,
  CASE 
    WHEN (
      -- user_id is nullable
      EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'venue_inquiries' 
          AND column_name = 'user_id' 
          AND is_nullable = 'YES'
      )
      -- Has RLS policies
      AND EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'venue_inquiries' 
          AND cmd = 'INSERT'
      )
    ) 
    THEN '✅ READY TO TEST! Try submitting a venue inquiry.'
    ELSE '❌ NOT READY - Run RUN-THIS-NOW.sql first'
  END as status;

SELECT 
  '========================================' as separator;

-- Show most recent inquiries (if any)
SELECT 
  '📋 Recent Inquiries (Last 3)' as info;

SELECT 
  full_name,
  email,
  CASE WHEN user_id IS NULL THEN '👤 Anonymous' ELSE '🔐 Logged In' END as user_type,
  status,
  created_at
FROM venue_inquiries
ORDER BY created_at DESC
LIMIT 3;
