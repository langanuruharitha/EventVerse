-- ============================================
-- FIX EXPENSES RLS - CORRECT VERSION
-- ============================================
-- The expenses table has budget_id, not event_id
-- Need to join through budgets to check event ownership
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their event expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can update expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can delete expenses for their events" ON expenses;

-- Create correct policies (join through budgets → events)
CREATE POLICY "Users can view their expenses"
ON expenses FOR SELECT TO authenticated
USING (
  budget_id IN (
    SELECT b.id FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their expenses"
ON expenses FOR INSERT TO authenticated
WITH CHECK (
  budget_id IN (
    SELECT b.id FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their expenses"
ON expenses FOR UPDATE TO authenticated
USING (
  budget_id IN (
    SELECT b.id FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.user_id = auth.uid()
  )
)
WITH CHECK (
  budget_id IN (
    SELECT b.id FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their expenses"
ON expenses FOR DELETE TO authenticated
USING (
  budget_id IN (
    SELECT b.id FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.user_id = auth.uid()
  )
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Expenses RLS policies fixed!';
  RAISE NOTICE '📋 Expenses table uses budget_id (not event_id)';
  RAISE NOTICE '🎉 You can now add/view expenses!';
END $$;
