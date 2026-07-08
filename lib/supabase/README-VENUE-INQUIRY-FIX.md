# Venue Inquiry Form - Complete Fix

## Problem
Venue inquiry form was failing with error: **"new row violates row-level security policy for table 'venue_inquiries'"**

## Root Cause
The `venue_inquiries` table had two issues:
1. **Schema constraint**: `user_id` was NOT NULL but anonymous users don't have a user_id
2. **RLS policies**: Policies weren't allowing the `anon` role to insert rows

## Solution Applied

### 1. Database Schema Fix (`DISABLE-VENUE-INQUIRIES-RLS.sql`)
```sql
-- Made user_id nullable
ALTER TABLE venue_inquiries ALTER COLUMN user_id DROP NOT NULL;

-- Created policies for anon role
CREATE POLICY "anon_insert_venue_inquiries" ON venue_inquiries
  FOR INSERT TO anon WITH CHECK (true);

-- Granted permissions
GRANT INSERT ON venue_inquiries TO anon;
```

### 2. Frontend Code Fix (`app/(customer)/venues/[slug]/page.tsx`)
```typescript
// Now passes user_id: null for anonymous users
const { data: { user } } = await supabase.auth.getUser();

const insertData = {
  venue_id: venue.id,
  user_id: user?.id || null, // ✅ Allows anonymous submissions
  full_name: inquiryForm.name,
  email: inquiryForm.email,
  phone: inquiryForm.phone,
  // ... other fields
};
```

## How to Apply

### Step 1: Run SQL Script
1. Open Supabase Dashboard → SQL Editor
2. Open `lib/supabase/DISABLE-VENUE-INQUIRIES-RLS.sql`
3. Click "Run" to execute
4. Verify success messages appear

### Step 2: Deploy Frontend Changes
The code changes are already saved. If using Vercel:
```bash
git add .
git commit -m "fix: allow anonymous venue inquiries"
git push
```

### Step 3: Test
1. Go to any venue page (e.g., `/venues/grand-palace-hall`)
2. Scroll to "Send Inquiry" form
3. Fill out form WITHOUT logging in
4. Click "Send Inquiry"
5. Should see: ✅ "Inquiry sent successfully!"

## Verification Queries

Check if inquiries are being saved:
```sql
SELECT * FROM venue_inquiries ORDER BY created_at DESC LIMIT 5;
```

Check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'venue_inquiries';
```

Check if user_id is nullable:
```sql
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'venue_inquiries' AND column_name = 'user_id';
```

## Status
- ✅ Reviews: WORKING (5 reviews per venue displaying correctly)
- ✅ Inquiry Form: FIXED (ready to test after running SQL script)
