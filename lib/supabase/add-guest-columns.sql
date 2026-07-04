-- Add missing columns to guests table for Phase 05 guest form
-- Run this in your Supabase SQL editor

-- Add guest_name if it doesn't exist (alias for full_name)
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);

-- Update guest_name from full_name for existing records
UPDATE guests SET guest_name = full_name WHERE guest_name IS NULL;

-- Add city/village column
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS city VARCHAR(255);

-- Add age_group column
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS age_group VARCHAR(20) DEFAULT 'adult';

-- Add address column (if not exists from Phase 05)
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Add category column (simpler than guest_category)
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';

-- Add invitation_sent boolean (simpler version)
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE;

-- Ensure these columns exist (from Phase 05 schema)
ALTER TABLE guests 
  ADD COLUMN IF NOT EXISTS plus_ones_allowed INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plus_ones_confirmed INT DEFAULT 0;

-- Update existing guest_category to category
UPDATE guests SET category = guest_category WHERE category = 'general' AND guest_category IS NOT NULL;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_guests_city ON guests(city);
CREATE INDEX IF NOT EXISTS idx_guests_category ON guests(category);
CREATE INDEX IF NOT EXISTS idx_guests_age_group ON guests(age_group);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Guest table columns added successfully!';
  RAISE NOTICE 'New columns: guest_name, city, age_group, address, category, invitation_sent';
END $$;
