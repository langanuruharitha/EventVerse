# 🔧 Fix Everything - Complete Solution

## Problem: You're seeing customer dashboard, not admin dashboard

**Root Cause:** Your account is registered as "customer" but should be "admin"

---

## 🚀 SOLUTION: Run These 2 Scripts in Supabase

### **STEP 1: Make Your Account Admin**

1. Open: https://supabase.com/dashboard
2. Click: Your EventVerse project
3. Click: SQL Editor
4. Click: + New query
5. **Copy and paste this ENTIRE script:**

```sql
-- =====================================================
-- MAKE HARITHALANGANURU@GMAIL.COM AN ADMIN
-- =====================================================

-- Change role from customer to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'harithalanganuru@gmail.com';

-- Verify the change
SELECT 
  email,
  role,
  '✅ You are now an admin!' as status
FROM users
WHERE email = 'harithalanganuru@gmail.com';
```

6. Click: **Run**
7. You should see: `✅ You are now an admin!`

---

### **STEP 2: Create Notifications Table**

1. Still in SQL Editor
2. Click: + New query
3. **Copy and paste this ENTIRE script:**

```sql
-- =====================================================
-- CREATE ADMIN NOTIFICATIONS TABLE
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop table if exists (clean start)
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- Create the table
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_notification_type CHECK (type IN ('signup', 'login'))
);

-- Create indexes
CREATE INDEX idx_admin_notifications_unread ON admin_notifications(is_read, created_at DESC);
CREATE INDEX idx_admin_notifications_type ON admin_notifications(type, created_at DESC);
CREATE INDEX idx_admin_notifications_created ON admin_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all notifications" ON admin_notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (true);

SELECT '✅ Notifications table created!' as status;
```

4. Click: **Run**
5. You should see: `✅ Notifications table created!`

---

## 🎯 STEP 3: Sign Out and Sign Back In

**IMPORTANT:** You MUST sign out and sign back in for the role change to take effect!

1. **In your EventVerse site:**
2. Click: Sign Out (or logout button)
3. Go to: `/admin/login` or just the homepage
4. Sign in again with: `harithalanganuru@gmail.com`
5. You should now be redirected to: `/admin/dashboard` (not `/dashboard`)
6. Check the sidebar: You should see "Notifications 🔔" menu

---

## ✅ STEP 4: Test Notifications

### Test Login Notification:

1. **Open a new incognito/private window**
2. Go to your EventVerse site
3. **Sign up** as a new customer:
   - Email: `testcustomer123@example.com`
   - Name: `Test Customer`
   - Password: `Test@123`
   - Role: Customer
4. Click: Sign Up
5. **Go back to your admin window**
6. Go to: `/admin/notifications`
7. **Refresh** the page
8. **You should see:** 🎉 "New Customer Signup" notification!

### Test Login Notification:

1. **Sign out** from the test account
2. **Sign in** again with the same credentials
3. **Go to admin notifications**
4. **Refresh**
5. **You should see:** 👤 "User Login Notification"

---

## 🚨 If Still Not Working

### Check #1: Verify Your Role Changed

**In Supabase SQL Editor, run:**
```sql
SELECT email, role FROM users WHERE email = 'harithalanganuru@gmail.com';
```

**Expected:** role = 'admin'
**If not:** Run STEP 1 again

### Check #2: Verify Table Exists

**In Supabase SQL Editor, run:**
```sql
SELECT COUNT(*) FROM admin_notifications;
```

**Expected:** Returns a number (0 or more)
**If error:** Run STEP 2 again

### Check #3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to "Console" tab
3. Sign up or login as customer/vendor
4. Look for errors about `/api/admin/notify-signup`
5. If you see "404 Not Found" → Vercel has old code, needs redeploy

### Check #4: Verify Deployment

**Check if latest code is deployed:**

1. Go to: https://vercel.com/dashboard
2. Click: Your EventVerse project
3. Click: Deployments
4. Check: Latest deployment is successful (green checkmark)
5. If failed or old:
   - Settings → General → Root Directory = `eventverse-app`
   - Redeploy with clear cache

---

## 📊 Expected Results After Fix

### When You Login:
- ✅ Redirected to `/admin/dashboard` (not `/dashboard`)
- ✅ Sidebar shows "Notifications 🔔" menu
- ✅ Can access `/admin/notifications` page
- ✅ Can see notifications list (even if empty)

### When Customer/Vendor Signs Up:
- ✅ Notification appears in admin panel
- ✅ Shows: Name, email, role, timestamp
- ✅ Type: "signup"

### When Customer/Vendor Logs In:
- ✅ Notification appears in admin panel
- ✅ Shows: Login details
- ✅ Type: "login"

---

## 🎯 Summary

**What We're Fixing:**
1. ✅ Change your account role from "customer" to "admin"
2. ✅ Create admin_notifications table in database
3. ✅ Sign out and sign back in (to refresh role)
4. ✅ Test notifications work

**Time Required:** 5 minutes

**Start with STEP 1 right now!** 🚀

---

## 📞 After You Run These Scripts

**Tell me:**
1. Did STEP 1 show "✅ You are now an admin!"?
2. Did STEP 2 show "✅ Notifications table created!"?
3. After signing out and back in, do you see `/admin/dashboard`?
4. Do you see "Notifications 🔔" in the sidebar?

Then we can test if notifications are working! 🎉
