-- FIX GUEST RLS POLICY - Run this in Supabase SQL Editor NOW
-- This fixes: "new row violates row-level security policy for table 'guests'"

-- Enable RLS on guests table
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on guests table
DROP POLICY IF EXISTS "Users can manage their event guests" ON guests;
DROP POLICY IF EXISTS "Users can view their event guests" ON guests;
DROP POLICY IF EXISTS "Users can insert guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can update guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can delete guests for their events" ON guests;

-- Create new correct policies
-- Policy 1: Users can view guests for their own events
CREATE POLICY "Users can view their event guests"
ON guests FOR SELECT
TO authenticated
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

-- Policy 2: Users can insert guests for their own events
CREATE POLICY "Users can insert guests for their events"
ON guests FOR INSERT
TO authenticated
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

-- Policy 3: Users can update guests for their own events
CREATE POLICY "Users can update guests for their events"
ON guests FOR UPDATE
TO authenticated
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

-- Policy 4: Users can delete guests for their own events
CREATE POLICY "Users can delete guests for their events"
ON guests FOR DELETE
TO authenticated
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'guests';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Guest RLS policies fixed!';
  RAISE NOTICE '📋 Policies created: SELECT, INSERT, UPDATE, DELETE';
  RAISE NOTICE '🎉 You can now add guests!';
END $$;
