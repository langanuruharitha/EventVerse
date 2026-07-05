# 🗑️ How to Delete Test User Accounts (UPDATED)

## ⚠️ Important: Use SQL Method

The Supabase dashboard delete button fails because test users have related data (events, guests, budgets). We need to use SQL to delete everything properly.

## 📍 Method: Delete Via SQL Editor (Works 100%)

### Step 1: Go to SQL Editor

1. Open: https://supabase.com/dashboard
2. Select your **EventVerse** project
3. Click **SQL Editor** in the left sidebar
4. Click **"New Query"** button

### Step 2: Run the Delete Script

1. Open the file: `lib/supabase/FORCE-DELETE-TEST-USERS.sql`
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** or press `Ctrl + Enter`
5. Wait for success message

### Step 3: Verify Deletion

After running the SQL, go to **Authentication → Users** and verify the test accounts are gone.

## 🎯 What Gets Deleted:

When you run this SQL, it deletes:
- ❌ customer@gmail.com and all their data
- ❌ customer1@gmail.com and all their data
- ❌ customer2@gmail.com and all their data
- ❌ vendor@gmail.com and all their data
- ❌ vendor1@gmail.com and all their data

**Including:**
- All events created by these users
- All guests added by these users
- All budgets created by these users
- All tasks, shopping lists, etc.
- Their user profiles
- Their authentication accounts

**Keeps:**
- ✅ harithalanganuru@gmail.com (your admin account)
- ✅ Any other real accounts

## 📋 Quick Steps:


1. Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Open `lib/supabase/FORCE-DELETE-TEST-USERS.sql`
4. Copy all SQL
5. Paste in SQL Editor
6. Click **"Run"**
7. Done! ✅

## ⚠️ Why Dashboard Delete Fails

Error: "Failed to delete user: Database error deleting user"

**Reason**: Test users have related data (foreign key constraints):
- Events they created
- Guests they added
- Budgets they made
- Tasks, shopping lists, etc.

**Solution**: SQL script deletes related data first, then the user.

## 🔧 Alternative: Manual Cleanup (Not Recommended)

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
