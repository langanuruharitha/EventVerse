-- =====================================================
-- DELETE SPECIFIC USERS ONLY
-- Deletes ONLY:
--   1. langanuruharitha@gmail.com
--   2. 24691a3185@mits.ac.in
-- Keeps: harithalanganuru@gmail.com and all other users
-- =====================================================

-- Step 1: Show users to be deleted
SELECT 
  '🗑️ Users to be deleted:' as action,
  id,
  email,
  role
FROM auth.users
WHERE email IN (
  'langanuruharitha@gmail.com',
  '24691a3185@mits.ac.in'
);

-- Step 2: Delete related data first (cascading order)

-- Delete vendor-related data for these specific users
DELETE FROM vendor_lead_actions
WHERE lead_id IN (
  SELECT id FROM vendor_leads 
  WHERE vendor_id IN (
    SELECT id FROM auth.users 
    WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
  )
);

DELETE FROM vendor_leads
WHERE vendor_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

DELETE FROM vendor_inquiries
WHERE vendor_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

DELETE FROM vendor_notifications
WHERE vendor_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

DELETE FROM vendor_profiles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete venue inquiries from these users
DELETE FROM venue_inquiries
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete product reviews
DELETE FROM product_reviews
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete venue reviews
DELETE FROM venue_reviews
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete shopping cart items
DELETE FROM cart_items
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete orders
DELETE FROM orders
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete wishlists
DELETE FROM wishlists
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete guests from events created by these users (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'guests') THEN
    DELETE FROM guests
    WHERE event_id IN (
      SELECT id FROM events 
      WHERE user_id IN (
        SELECT id FROM auth.users 
        WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
      )
    );
  END IF;
END $$;

-- Delete event tasks (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_tasks') THEN
    DELETE FROM event_tasks
    WHERE event_id IN (
      SELECT id FROM events 
      WHERE user_id IN (
        SELECT id FROM auth.users 
        WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
      )
    );
  END IF;
END $$;

-- Delete budget items (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'budget_items') THEN
    DELETE FROM budget_items
    WHERE event_id IN (
      SELECT id FROM events 
      WHERE user_id IN (
        SELECT id FROM auth.users 
        WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
      )
    );
  END IF;
END $$;

-- Delete events (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    DELETE FROM events
    WHERE user_id IN (
      SELECT id FROM auth.users 
      WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
    );
  END IF;
END $$;

-- Delete user profiles
DELETE FROM user_profiles
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete from public.users table
DELETE FROM users
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Step 3: Delete from auth.users (main table)
DELETE FROM auth.users
WHERE email IN (
  'langanuruharitha@gmail.com',
  '24691a3185@mits.ac.in'
);

-- Step 4: Verify deletion and show remaining users
SELECT 
  '✅ Remaining users after deletion:' as result,
  id,
  email,
  role,
  created_at
FROM auth.users
ORDER BY created_at;

SELECT 
  '✅ Total users remaining: ' || COUNT(*) as summary
FROM auth.users;

-- Verification message
DO $$ 
DECLARE
  deleted_count INT;
  remaining_count INT;
BEGIN
  -- Check if the specific users were deleted
  SELECT COUNT(*) INTO deleted_count 
  FROM auth.users 
  WHERE email IN ('langanuruharitha@gmail.com', '24691a3185@mits.ac.in');
  
  SELECT COUNT(*) INTO remaining_count FROM auth.users;
  
  IF deleted_count = 0 THEN
    RAISE NOTICE '✅ SUCCESS: Both users deleted successfully!';
    RAISE NOTICE '✅ Remaining users: %', remaining_count;
  ELSE
    RAISE NOTICE '⚠️ WARNING: % user(s) still remain that should be deleted', deleted_count;
  END IF;
END $$;
