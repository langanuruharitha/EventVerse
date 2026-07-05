# 🗑️ How to Delete Test User Accounts

## 📍 Quick Guide: Delete Via Supabase Dashboard (Easiest)

### Step 1: Go to Authentication

1. Open: https://supabase.com/dashboard
2. Select your **EventVerse** project
3. Click **Authentication** in the left sidebar (the icon looks like a key 🔑)
4. Click **Users** tab

### Step 2: Find and Delete Test Users

You'll see a list of all registered users. Look for these test accounts:
- customer@gmail.com
- customer1@gmail.com
- customer2@gmail.com
- vendor@gmail.com
- vendor1@gmail.com
- customer (no email domain)

**For each test user:**

1. Find the user in the list
2. Click the **three dots (⋯)** on the right side of that row
3. Click **"Delete user"**
4. Confirm by clicking **"Delete"** in the popup

**Repeat for all test accounts you want to remove.**

### Step 3: Verify

After deleting, refresh the page and verify the test accounts are gone.

**Keep these accounts:**
- ✅ harithalanganuru@gmail.com (your real admin account)
- ✅ Any other real accounts you created

**Delete these accounts:**
- ❌ customer@gmail.com
- ❌ customer1@gmail.com
- ❌ customer2@gmail.com
- ❌ vendor@gmail.com
- ❌ vendor1@gmail.com

## 🔧 Alternative: Delete Via SQL (Advanced)

If you prefer SQL:

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Copy the SQL from: `lib/supabase/DELETE-TEST-ACCOUNTS.sql`
4. Paste and run it

## ⚠️ Important Notes

1. **Cannot undo** - Deleted users cannot be recovered
2. **Keep your admin account** - Don't delete harithalanganuru@gmail.com
3. **Authentication + Database** - Deleting from dashboard removes from both auth and database
4. **Related data** - User's events, guests, budgets will also be deleted (cascade delete)

## ✅ After Deletion

Your Users Management page will be cleaner and only show:
- Real accounts
- No test/fake accounts

## 🎯 Why Delete Test Accounts?

1. Cleaner user management
2. Accurate user counts
3. No confusion with test data
4. Better for production use

---

**Go to Supabase → Authentication → Users and delete the test accounts now!** 🗑️
