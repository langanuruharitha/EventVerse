-- QUICK FIX FOR GUEST ADD FAILURE
-- Run this in Supabase SQL Editor NOW

-- Add missing guest columns
ALTER TABLE guests ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS city VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS age_group VARCHAR(20) DEFAULT 'adult';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_allowed INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_confirmed INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS special_requirements TEXT;

-- Update guest_name from full_name for existing records
UPDATE guests SET guest_name = full_name WHERE guest_name IS NULL;

-- Success
SELECT 'Guest columns added successfully!' as message;
