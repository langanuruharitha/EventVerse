-- =====================================================
-- STRUCTURAL FIX: Update Foreign Key to CASCADE
-- =====================================================
-- This fixes the vendor_lead_actions foreign key constraint
-- so future user deletions automatically delete their actions
-- instead of throwing an error

-- ============================================
-- PROBLEM:
-- ============================================
-- Current FK: vendor_lead_actions_action_by_fkey
-- Constraint: action_by REFERENCES users(id)
-- Behavior: ON DELETE RESTRICT (default - causes error when deleting user)
--
-- ERROR: "update or delete on table 'users' violates foreign key 
--         constraint 'vendor_lead_actions_action_by_fkey' on table 
--         'vendor_lead_actions'"

-- ============================================
-- SOLUTION:
-- ============================================
-- Change FK behavior to ON DELETE CASCADE
-- This means: When a user is deleted, automatically delete their actions

-- ============================================
-- STEP 1: Drop the existing foreign key constraint
-- ============================================
ALTER TABLE vendor_lead_actions 
DROP CONSTRAINT IF EXISTS vendor_lead_actions_action_by_fkey;

-- ============================================
-- STEP 2: Add new constraint with CASCADE behavior
-- ============================================
ALTER TABLE vendor_lead_actions 
ADD CONSTRAINT vendor_lead_actions_action_by_fkey 
FOREIGN KEY (action_by) 
REFERENCES users(id) 
ON DELETE CASCADE;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check the new constraint
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
  AND rc.constraint_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'vendor_lead_actions'
  AND kcu.column_name = 'action_by';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '✅ Foreign key constraint updated to CASCADE!' as status;
SELECT 'Users can now be deleted without FK errors in vendor_lead_actions' as info;

-- ============================================
-- NOTES:
-- ============================================
-- After running this script:
-- 1. Deleting a user will automatically delete their vendor_lead_actions
-- 2. No more "violates foreign key constraint" errors
-- 3. This is the BEST practice for audit/action tables
-- 4. The action records belong to the user, so they should be deleted together
--
-- Alternative approach (if you want to keep actions):
-- - Use ON DELETE SET NULL instead of CASCADE
-- - This keeps the action record but sets action_by to NULL
-- - Useful if you want historical records even after user deletion
-- - Change line 41 to: ON DELETE SET NULL
