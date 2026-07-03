-- ============================================
-- FIX EVENT TIMING CONSTRAINT
-- ============================================
-- This fixes: "new row for relation events violates check constraint events_event_timing_check"
-- The form sends "night" but the database only allows: morning, afternoon, evening, full_day
-- ============================================

-- Drop the existing constraint
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_timing_check;

-- Add new constraint that includes "night"
ALTER TABLE events ADD CONSTRAINT events_event_timing_check 
CHECK (event_timing IN ('morning', 'afternoon', 'evening', 'night', 'full_day'));

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Event timing constraint updated!';
  RAISE NOTICE '📋 Allowed values: morning, afternoon, evening, night, full_day';
  RAISE NOTICE '🎉 Event creation should work now!';
END $$;
