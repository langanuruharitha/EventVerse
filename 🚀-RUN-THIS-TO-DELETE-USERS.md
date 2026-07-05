# 🚀 DELETE TEST USERS - SIMPLE STEPS

## ⚡ Quick Instructions (2 minutes)

> ✅ **UPDATED:** Script fixed for `vendor_notifications` column issue!

### 📍 Step 1: Fix the Database Structure
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**
2. Open this file on your computer: `lib/supabase/FIX-VENDOR-LEAD-FK-CASCADE.sql`
3. Copy **ALL** the code
4. Paste into Supabase SQL Editor
5. Click **RUN** button
6. ✅ Wait for success message

---

### 📍 Step 2: Delete Test Users (NOW FIXED!)
1. In Supabase SQL Editor, click **New Query**
2. Open this file: `lib/supabase/DELETE-CUSTOMER-CUSTOMER2.sql`
3. Copy **ALL** the code
4. Paste into SQL Editor
5. Click **RUN** button
6. ✅ Wait for: "customer@gmail.com and customer2@gmail.com deleted!"

> **Note:** The script has been fixed to handle the `vendor_notifications` table correctly (uses `vendor_id`, not `user_id`)

---

### 📍 Step 3: Verify
1. Go to **Authentication** → **Users** in Supabase
2. Check that test accounts are gone
3. Only `harithalanganuru@gmail.com` should remain

---

## ✅ Done!

Your database is now clean and future user deletions will work properly! 🎉

---

## 📁 Files You Need

| File | Purpose |
|------|---------|
| `FIX-VENDOR-LEAD-FK-CASCADE.sql` | Fixes database structure (run once) |
| `DELETE-CUSTOMER-CUSTOMER2.sql` | Deletes the 2 test users |

Both files are in: `lib/supabase/` folder

---

## 🆘 If You Get Errors

Copy the error message and share with me. I'll help immediately!

---

## 📖 Want More Details?

Read: `lib/supabase/DELETE-USERS-GUIDE.md` for complete explanation
