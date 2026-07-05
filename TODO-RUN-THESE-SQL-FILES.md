# 📋 TODO: Run These SQL Files in Supabase

## 🎯 You Need to Run 3 SQL Files

All code is deployed to Vercel ✅, but you need to run these SQL scripts in your Supabase database:

---

## Step 1: Fix Your Admin Role ⚠️ IMPORTANT FIRST!

**File**: `lib/supabase/FIX-HARITHA-TO-ADMIN.sql`

**What it does**: Changes harithalanganuru@gmail.com from "customer" to "admin"

**SQL to run**:
```sql
UPDATE users
SET role = 'admin'
WHERE email = 'harithalanganuru@gmail.com';
```

**Why**: Your account is currently showing as "customer" in the users table

---

## Step 2: Enable Signup Notifications

**File**: `lib/supabase/ADMIN-NOTIFICATIONS-SYSTEM.sql`

**What it does**: 
- Creates `admin_notifications` table
- Creates automatic trigger for new signups
- Notifies you when vendors/customers sign up

**How to run**:
1. Open the file `lib/supabase/ADMIN-NOTIFICATIONS-SYSTEM.sql`
2. Copy ALL the SQL code
3. Go to Supabase → SQL Editor
4. Paste and click RUN

---

## Step 3: Enable Login Tracking

**File**: `lib/supabase/TRACK-CUSTOMER-LOGINS.sql`

**What it does**:
- Creates `user_login_history` table
- Creates function to track logins
- Notifies you when customers/vendors log in

**How to run**:
1. Open the file `lib/supabase/TRACK-CUSTOMER-LOGINS.sql`
2. Copy ALL the SQL code
3. Go to Supabase → SQL Editor
4. Paste and click RUN

---

## ✅ After Running All SQL Files

You will have:

### In Admin Portal (`/admin/notifications`):
- 🔔 Notifications page in sidebar
- 🏪 New vendor signup notifications
- 👤 New customer signup notifications
- 🏪 Vendor login notifications (NEW!)
- 👤 Customer login notifications (NEW!)
- Red badge showing unread count
- Filter by type/status
- Mark as read functionality

### Features:
✅ Track ALL signups (vendors & customers)
✅ Track ALL logins (vendors & customers)
✅ Real-time updates every 30 seconds
✅ Admin role fixed for harithalanganuru@gmail.com
✅ Email prepared (harithalanganuru@gmail.com)
✅ Beautiful UI with emojis and timestamps

---

## 🚀 Quick Test

After running the SQL:

1. **Test Notifications Page**:
   - Go to: https://eventverse-app-sand.vercel.app/admin/notifications
   - Should load without errors

2. **Test Signup Tracking**:
   - Create a new customer account
   - Check `/admin/notifications`
   - Should see: 👤 "New Customer Registration"

3. **Test Login Tracking**:
   - Log in as a customer or vendor
   - Check `/admin/notifications`
   - Should see: 👤 "Customer Login" or 🏪 "Vendor Login"

---

## 📧 Email Notifications (Optional - Later)

Right now notifications only show in admin panel.

To get emails to **harithalanganuru@gmail.com**:
- See: `SETUP-LOGIN-TRACKING.md`
- Setup options: Resend, SendGrid, or Supabase Webhooks

---

## 📂 Files Location

All SQL files are in:
- `lib/supabase/FIX-HARITHA-TO-ADMIN.sql`
- `lib/supabase/ADMIN-NOTIFICATIONS-SYSTEM.sql`
- `lib/supabase/TRACK-CUSTOMER-LOGINS.sql`

---

## 🎯 Summary

**Order to run**:
1. ✅ Fix admin role (FIX-HARITHA-TO-ADMIN.sql)
2. ✅ Enable signup notifications (ADMIN-NOTIFICATIONS-SYSTEM.sql)
3. ✅ Enable login tracking (TRACK-CUSTOMER-LOGINS.sql)

**Where to run**: Supabase Dashboard → SQL Editor

**Time needed**: 5 minutes total

**Result**: Full notification system for admin! 🎉

---

## ❓ Need Help?

If any SQL file fails:
1. Check the error message in Supabase
2. Make sure you ran them in order (1, 2, 3)
3. Check that the tables don't already exist
4. Try running them one at a time

The system is already deployed to Vercel and waiting for the database setup! 🚀
