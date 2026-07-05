-- =====================================================
-- DELETE ONLY customer@gmail.com and customer2@gmail.com
-- =====================================================
-- FIXED VERSION: Handles the specific foreign key constraint error

-- ============================================
-- DIAGNOSTIC: Check what will be deleted
-- ============================================
SELECT 
  'Users to delete:' as info,
  id, 
  email, 
  role 
FROM users 
WHERE email IN ('customer@gmail.com', 'customer2@gmail.com');

SELECT 
  'vendor_lead_actions with these users as action_by:' as info,
  COUNT(*) as count
FROM vendor_lead_actions
WHERE action_by IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 1: Delete vendor_lead_actions where action_by references these users
-- ============================================
-- This is the KEY step that was causing the FK constraint error
-- The specific error mentioned action_by = '2e498ab3-67de-4536-8932-52f74f13c6aa'

DELETE FROM vendor_lead_actions 
WHERE action_by IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 2: Delete vendor_lead_actions for leads created by these users
-- ============================================
DELETE FROM vendor_lead_actions
WHERE lead_id IN (
  SELECT id FROM vendor_leads WHERE customer_id IN (
    SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
  )
);

-- ============================================
-- STEP 3: Delete vendor_leads created by these users
-- ============================================
DELETE FROM vendor_leads 
WHERE customer_id IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 4: Delete vendor_inquiries
-- ============================================
DELETE FROM vendor_inquiries 
WHERE customer_id IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 5: Delete vendor_notifications (if table exists)
-- ============================================
-- Note: vendor_notifications uses vendor_id, not user_id
-- We need to find vendors owned by these users first
DELETE FROM vendor_notifications 
WHERE vendor_id IN (
  SELECT id FROM vendors WHERE user_id IN (
    SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
  )
);

-- ============================================
-- STEP 6: Delete vendors owned by these users (if any)
-- ============================================
DELETE FROM vendors 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 7: Delete events and cascade data (guests, budgets, etc.)
-- ============================================
DELETE FROM events 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 8: Delete user profiles
-- ============================================
DELETE FROM user_profiles 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('customer@gmail.com', 'customer2@gmail.com')
);

-- ============================================
-- STEP 9: Delete from public.users table
-- ============================================
DELETE FROM users 
WHERE email IN ('customer@gmail.com', 'customer2@gmail.com');

-- ============================================
-- STEP 10: Delete from auth.users table (Supabase authentication)
-- ============================================
DELETE FROM auth.users 
WHERE email IN ('customer@gmail.com', 'customer2@gmail.com');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check remaining users
SELECT email, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- Success message
SELECT 'customer@gmail.com and customer2@gmail.com deleted! ✅' as status;
