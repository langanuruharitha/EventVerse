-- =====================================================
-- DELETE ALL USERS EXCEPT SPECIFIED ONES
-- Keeps: 
--   1. harithalanganuru@gmail.com (ADMIN)
--   2. langanuruharitha@gmail.com (CUSTOMER)  
--   3. 24691a3185@mits.ac.in (VENDOR)
-- =====================================================

-- Step 1: Identify users to delete
SELECT 
  'Users to be deleted:' as action,
  id,
  email,
  role
FROM auth.users
WHERE email NOT IN (
  'harithalanganuru@gmail.com',
  'langanuruharitha@gmail.com',
  '24691a3185@mits.ac.in'
);

-- Step 2: Delete related data first (cascading order)

-- Delete vendor-related data
DELETE FROM vendor_lead_actions
WHERE vendor_lead_id IN (
  SELECT id FROM vendor_leads 
  WHERE vendor_id IN (
    SELECT id FROM auth.users 
    WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
  )
);

DELETE FROM vendor_leads
WHERE vendor_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

DELETE FROM vendor_inquiries
WHERE vendor_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

DELETE FROM vendor_notifications
WHERE vendor_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

DELETE FROM vendor_profiles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete venue inquiries from other users
DELETE FROM venue_inquiries
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
)
AND user_id IS NOT NULL;

-- Delete product reviews
DELETE FROM product_reviews
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete venue reviews
DELETE FROM venue_reviews
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete shopping cart items
DELETE FROM cart_items
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete orders
DELETE FROM orders
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete wishlists
DELETE FROM wishlists
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete guests
DELETE FROM guests
WHERE event_id IN (
  SELECT id FROM events 
  WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
  )
);

-- Delete event tasks
DELETE FROM event_tasks
WHERE event_id IN (
  SELECT id FROM events 
  WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
  )
);

-- Delete budget items
DELETE FROM budget_items
WHERE event_id IN (
  SELECT id FROM events 
  WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
  )
);

-- Delete events
DELETE FROM events
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete user profiles
DELETE FROM user_profiles
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Delete from public.users table
DELETE FROM users
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email NOT IN ('harithalanganuru@gmail.com', 'langanuruharitha@gmail.com', '24691a3185@mits.ac.in')
);

-- Step 3: Delete from auth.users (main table)
DELETE FROM auth.users
WHERE email NOT IN (
  'harithalanganuru@gmail.com',
  'langanuruharitha@gmail.com',
  '24691a3185@mits.ac.in'
);

-- Step 4: Verify remaining users
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

-- Verification: Check if only 3 users remain
DO $$ 
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 3 THEN
    RAISE NOTICE '✅ SUCCESS: Exactly 3 users remain (admin, customer, vendor)';
  ELSE
    RAISE NOTICE '⚠️ WARNING: Expected 3 users but found %', user_count;
  END IF;
END $$;
