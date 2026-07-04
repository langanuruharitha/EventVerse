-- Fix Event Creation Error - RLS Policy Issue
-- This fixes the "new row violates row-level security policy for table events" error

-- ============================================
-- SOLUTION: Fix RLS Policies for Events Table
-- ============================================

-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create correct RLS policies
-- 1. INSERT: Users can create events for themselves
CREATE POLICY "Users can insert their own events"
ON events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. SELECT: Users can view their own events
CREATE POLICY "Users can view their own events"
ON events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. UPDATE: Users can update their own events
CREATE POLICY "Users can update their own events"
ON events
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. DELETE: Users can delete their own events
CREATE POLICY "Users can delete their own events"
ON events
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Enable RLS on events table (if not already enabled)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CHECK CURRENT POLICIES
-- ============================================

-- Run this to see all policies on events table:
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'events';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies fixed for events table!';
  RAISE NOTICE '📋 Policies created: INSERT, SELECT, UPDATE, DELETE';
  RAISE NOTICE '🔒 All policies check: auth.uid() = user_id';
  RAISE NOTICE '🎉 You can now create events!';
END $$;
