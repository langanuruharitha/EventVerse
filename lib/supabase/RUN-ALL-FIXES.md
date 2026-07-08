# Complete Fix Instructions - Run These SQL Scripts

## Current Status
- ✅ Venue Reviews: **WORKING** (displaying correctly)
- ⚠️ Venue Inquiry Form: **NEEDS SQL FIX** (ready to deploy)
- ⚠️ Product Reviews: **NEEDS VERIFICATION** (may need RLS fix)

---

## STEP 1: Fix Venue Inquiry Form (CRITICAL)

### Run This Script First
**File:** `lib/supabase/DISABLE-VENUE-INQUIRIES-RLS.sql`

**What it does:**
- Makes `user_id` nullable (allows anonymous users to submit inquiries)
- Creates RLS policies for `anon` role
- Grants necessary permissions

**How to run:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy content from `DISABLE-VENUE-INQUIRIES-RLS.sql`
4. Click "Run"
5. Verify success messages appear

**Expected Output:**
```
✅ COMPLETE FIX APPLIED
✅ user_id is now nullable
✅ RLS policies created for anon, authenticated, and public roles
✅ Permissions granted to anon role
```

---

## STEP 2: Verify Product Reviews

### Check if reviews exist
**File:** `lib/supabase/CHECK-PRODUCT-REVIEWS.sql`

**Run this to check:**
- How many reviews exist
- Which products have reviews
- If RLS is enabled

### If reviews are missing or not displaying
**File:** `lib/supabase/ADD-PRODUCT-REVIEWS.sql`

**Then run:** `lib/supabase/FIX-PRODUCT-REVIEWS-RLS.sql`

---

## STEP 3: Deploy Frontend Changes

The frontend code has been updated in:
- `eventverse-app/app/(customer)/venues/[slug]/page.tsx`

### Deploy to Vercel
```bash
cd eventverse-app
git add .
git commit -m "fix: allow anonymous venue inquiries with user_id null"
git push
```

Vercel will auto-deploy within 2-3 minutes.

---

## STEP 4: Test Everything

### Test Venue Inquiry Form
1. Go to any venue page: `/venues/grand-palace-hall`
2. Scroll to "Send Inquiry" form
3. Fill form WITHOUT logging in
4. Click "Send Inquiry"
5. Should see: **✅ Inquiry sent successfully!**

### Test Venue Reviews
1. Same venue page
2. Scroll to "Reviews" section
3. Should see 5 reviews with ratings and text

### Test Product Reviews
1. Go to shop: `/shop`
2. Click any product
3. Scroll to reviews section
4. Should see 5 reviews per product

---

## Verification Queries

### Check venue inquiries are being saved
```sql
SELECT * FROM venue_inquiries ORDER BY created_at DESC LIMIT 5;
```

### Check product reviews exist
```sql
SELECT COUNT(*) as total_reviews FROM product_reviews;
```

### Check RLS policies
```sql
-- Venue inquiries
SELECT * FROM pg_policies WHERE tablename = 'venue_inquiries';

-- Product reviews
SELECT * FROM pg_policies WHERE tablename = 'product_reviews';
```

---

## Quick Summary

| Feature | Status | Action Required |
|---------|--------|-----------------|
| Venue Reviews | ✅ Working | None |
| Venue Inquiry Form | ⚠️ Ready | Run SQL script + Deploy |
| Product Reviews | ⚠️ Check | Run verification query |

---

## Support

If you encounter errors:

1. **"policy already exists"**: Ignore - it's already fixed
2. **"column does not exist"**: Check table schema
3. **"permission denied"**: You need admin/owner access to Supabase

After running SQL scripts, **hard refresh** browser (Ctrl+Shift+R) to clear cache.
