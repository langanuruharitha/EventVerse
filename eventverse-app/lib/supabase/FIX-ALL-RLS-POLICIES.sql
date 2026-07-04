-- ============================================
-- FIX ALL RLS POLICIES FOR EVENTVERSE
-- ============================================
-- This fixes RLS blocking for: guests, expenses, tasks, budget, etc.
-- Run this ONCE in Supabase SQL Editor
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🚀 Starting RLS Policy Fix for All Tables...';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 1. EXPENSES TABLE RLS
-- ============================================
-- NOTE: Expenses table has budget_id, not event_id
-- Must join through budgets -> events

DO $$
BEGIN
  RAISE NOTICE '🔧 Fixing expenses table RLS...';
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their event expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view their event expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can update expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can delete expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can view their expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their expenses" ON expenses;

-- Create new policies (join through budgets -> events)
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

DO $$
BEGIN
  RAISE NOTICE '✅ Expenses RLS fixed (via budget_id -> events)';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 2. GUESTS TABLE RLS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fixing guests table RLS...';
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their event guests" ON guests;
DROP POLICY IF EXISTS "Users can view their event guests" ON guests;
DROP POLICY IF EXISTS "Users can insert guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can update guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can delete guests for their events" ON guests;

-- Create new policies
CREATE POLICY "Users can view their event guests"
ON guests FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert guests for their events"
ON guests FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can update guests for their events"
ON guests FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete guests for their events"
ON guests FOR DELETE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ Guests RLS fixed';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 3. TASKS TABLE RLS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fixing tasks table RLS...';
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their event tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their event tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks for their events" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks for their events" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks for their events" ON tasks;

-- Create new policies
CREATE POLICY "Users can view their event tasks"
ON tasks FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert tasks for their events"
ON tasks FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can update tasks for their events"
ON tasks FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete tasks for their events"
ON tasks FOR DELETE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ Tasks RLS fixed';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 4. SHOPPING LIST RLS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Fixing shopping_list table RLS...';
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their event shopping" ON shopping_list;
DROP POLICY IF EXISTS "Users can view their event shopping" ON shopping_list;
DROP POLICY IF EXISTS "Users can insert shopping for their events" ON shopping_list;
DROP POLICY IF EXISTS "Users can update shopping for their events" ON shopping_list;
DROP POLICY IF EXISTS "Users can delete shopping for their events" ON shopping_list;

-- Create new policies
CREATE POLICY "Users can view their event shopping"
ON shopping_list FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert shopping for their events"
ON shopping_list FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can update shopping for their events"
ON shopping_list FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete shopping for their events"
ON shopping_list FOR DELETE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- Enable RLS
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ Shopping list RLS fixed';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 5. DECORATIONS TABLE RLS (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'decorations') THEN
    RAISE NOTICE '🔧 Fixing decorations table RLS...';
    
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their event decorations" ON decorations';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their event decorations" ON decorations';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert decorations for their events" ON decorations';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update decorations for their events" ON decorations';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete decorations for their events" ON decorations';
    
    -- Create new policies
    EXECUTE 'CREATE POLICY "Users can view their event decorations" ON decorations FOR SELECT TO authenticated USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    EXECUTE 'CREATE POLICY "Users can insert decorations for their events" ON decorations FOR INSERT TO authenticated WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    EXECUTE 'CREATE POLICY "Users can update decorations for their events" ON decorations FOR UPDATE TO authenticated USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid())) WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    EXECUTE 'CREATE POLICY "Users can delete decorations for their events" ON decorations FOR DELETE TO authenticated USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    
    -- Enable RLS
    EXECUTE 'ALTER TABLE decorations ENABLE ROW LEVEL SECURITY';
    
    RAISE NOTICE '✅ Decorations RLS fixed';
  ELSE
    RAISE NOTICE '⏭️  Decorations table not found, skipping';
  END IF;
  RAISE NOTICE '';
END $$;

-- ============================================
-- 6. MEMORY/PHOTOS TABLE RLS (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_photos') THEN
    RAISE NOTICE '🔧 Fixing event_photos table RLS...';
    
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage their event photos" ON event_photos';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their event photos" ON event_photos';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert photos for their events" ON event_photos';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update photos for their events" ON event_photos';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete photos for their events" ON event_photos';
    
    -- Create new policies
    EXECUTE 'CREATE POLICY "Users can view their event photos" ON event_photos FOR SELECT TO authenticated USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    EXECUTE 'CREATE POLICY "Users can insert photos for their events" ON event_photos FOR INSERT TO authenticated WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    EXECUTE 'CREATE POLICY "Users can update photos for their events" ON event_photos FOR UPDATE TO authenticated USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid())) WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    EXECUTE 'CREATE POLICY "Users can delete photos for their events" ON event_photos FOR DELETE TO authenticated USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))';
    
    -- Enable RLS
    EXECUTE 'ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY';
    
    RAISE NOTICE '✅ Event photos RLS fixed';
  ELSE
    RAISE NOTICE '⏭️  Event photos table not found, skipping';
  END IF;
  RAISE NOTICE '';
END $$;

-- ============================================
-- FINAL SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '╔═══════════════════════════════════════════════╗';
  RAISE NOTICE '║     🎉 ALL RLS POLICIES FIXED! 🎉            ║';
  RAISE NOTICE '╚═══════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Expenses - FIXED';
  RAISE NOTICE '✅ Guests - FIXED';
  RAISE NOTICE '✅ Tasks - FIXED';
  RAISE NOTICE '✅ Shopping list - FIXED';
  RAISE NOTICE '✅ Decorations - FIXED (if exists)';
  RAISE NOTICE '✅ Event photos - FIXED (if exists)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 All event-related features now work!';
  RAISE NOTICE '';
END $$;
