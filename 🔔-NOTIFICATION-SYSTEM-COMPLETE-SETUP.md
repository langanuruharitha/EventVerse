# 🔔 Admin Notification System - Complete Setup Guide

## ✅ Current Status

**YOUR NOTIFICATION SYSTEM IS 100% COMPLETE!** All code is written and ready.

The system will notify admin when:
- ✅ **Any customer signs up** → Admin gets notification
- ✅ **Any vendor signs up** → Admin gets notification  
- ✅ **Any customer logs in** → Admin gets notification
- ✅ **Any vendor logs in** → Admin gets notification

Admin (`harithalanganuru@gmail.com`) can view all notifications at: `/admin/notifications`

---

## 🚀 Quick Setup (2 Steps)

### Step 1: Create Database Table

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: EventVerse
3. **Go to**: SQL Editor (left sidebar)
4. **Click**: "+ New query"
5. **Copy and paste** this entire SQL script:

```sql
-- =====================================================
-- ADMIN NOTIFICATIONS TABLE
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Notification Type
  type VARCHAR(50) NOT NULL,
  
  -- Notification Content
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  
  -- User Information
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Check constraint for notification type
  CONSTRAINT check_notification_type CHECK (type IN ('signup', 'login'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON admin_notifications(is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view their notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can update their notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON admin_notifications;

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

-- Success message
SELECT '✅ admin_notifications table created successfully!' as status;
```

6. **Click**: "Run" button
7. **Verify**: You should see "✅ admin_notifications table created successfully!"

---

### Step 2: Fix Vercel Deployment

Your code is already pushed to GitHub, but Vercel needs correct settings:

#### Option A: Fix Vercel Settings (Easiest)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: Your EventVerse project
3. **Go to**: Settings → General
4. **Find**: "Root Directory"
5. **Set to**: `eventverse-app` (NOT empty/root)
6. **Click**: Save
7. **Go to**: Deployments tab
8. **Click**: Latest deployment → "Redeploy"
9. **CHECK**: ☑️ "Clear Build Cache"
10. **Click**: Redeploy

#### Option B: Test Locally First (Verify It Works)

```bash
# Open terminal in project folder
cd eventverse-app
npm run dev
```

Then open: http://localhost:3000/admin/notifications

You should see the notifications page working perfectly!

---

## 📋 How It Works

### When Customer/Vendor Signs Up:
1. User fills signup form
2. Account created in database
3. **API automatically called**: `/api/admin/notify-signup`
4. Notification saved to `admin_notifications` table
5. Admin sees notification in `/admin/notifications`

### When Customer/Vendor Logs In:
1. User enters email/password
2. User authenticated
3. **API automatically called**: `/api/admin/notify-signup` (with type: 'login')
4. Notification saved to database
5. Admin sees notification immediately

### Notification Contains:
- 🎉 **Icon** (signup) or 👤 (login)
- **Title**: "New Customer Signup" or "User Login"
- **Message**: Full details with name, email, role, timestamp
- **User Info**: Name, email, role (customer/vendor)
- **Timestamp**: When it happened
- **Status**: Unread/Read

---

## 🎯 Testing the System

### Test 1: Signup Notification

1. **Open**: Your EventVerse site
2. **Click**: "Sign Up"
3. **Create** a test account:
   - Email: `testcustomer123@gmail.com`
   - Name: `Test Customer`
   - Role: Customer
   - Password: `Test@123`
4. **Submit** the form
5. **As Admin**, go to: `/admin/notifications`
6. **You should see**: "🎉 New Customer Signup" notification

### Test 2: Login Notification

1. **Sign out** from test account
2. **Sign in** again with same credentials
3. **As Admin**, go to: `/admin/notifications`
4. **You should see**: "👤 User Login Notification"

### Test 3: Vendor Notifications

1. **Sign up** as vendor with different email
2. **Check**: Admin notifications page
3. **You should see**: "🎉 New Vendor Signup"

---

## 🔍 Admin Dashboard Features

### Notifications Page: `/admin/notifications`

**Features:**
- ✅ **Filter by**: All / Unread / Signup / Login
- ✅ **Unread count** badge
- ✅ **Mark as read** (individual)
- ✅ **Mark all as read** (bulk)
- ✅ **Real-time** updates
- ✅ **Detailed info**: Name, email, role, timestamp

**Navigation:**
- Admin sidebar now has: **"Notifications 🔔"** menu item
- Click to view all notifications
- Unread notifications highlighted

---

## 📁 Files Updated (All Ready)

### Backend:
- ✅ `eventverse-app/app/api/admin/notify-signup/route.ts` - API endpoint
- ✅ `eventverse-app/lib/auth/actions.ts` - Signup/login triggers

### Frontend:
- ✅ `eventverse-app/app/admin/layout.tsx` - Notifications menu
- ✅ `eventverse-app/app/admin/notifications/page.tsx` - Dashboard

### Database:
- ✅ `lib/supabase/CREATE-ADMIN-NOTIFICATIONS.sql` - Table schema

---

## ❓ FAQ

### Q: Do admins get email notifications?
**A:** Currently NO. Notifications are stored in database only and visible in admin dashboard. To add real emails, see `ADD-EMAIL-NOTIFICATIONS.md`.

### Q: Can I turn off login notifications (only keep signup)?
**A:** Yes! Edit `eventverse-app/lib/auth/actions.ts` and remove/comment the notification code in `signIn()` function.

### Q: Where is admin email configured?
**A:** In `eventverse-app/app/api/admin/notify-signup/route.ts`, line 4:
```typescript
const ADMIN_EMAIL = 'harithalanganuru@gmail.com';
```

### Q: What if notification menu is not visible?
**A:** This means deployment failed or used old code. Solutions:
1. Check Vercel Root Directory setting (should be `eventverse-app`)
2. Clear build cache and redeploy
3. Test locally first to confirm code works

### Q: Can multiple admins see notifications?
**A:** YES! All users with `role = 'admin'` can view all notifications.

### Q: Do notifications work offline?
**A:** NO. Requires internet to call API and save to database.

---

## 🎉 Success Indicators

After completing setup, you should have:

### ✅ Database:
- `admin_notifications` table exists in Supabase
- Table has correct columns and indexes
- RLS policies allow admins to read/update

### ✅ Admin Panel:
- Sidebar shows "Notifications 🔔" menu
- `/admin/notifications` page loads (not 404)
- Can filter by All/Unread/Signup/Login
- Can mark notifications as read

### ✅ Functionality:
- New customer signup → notification created
- New vendor signup → notification created
- Customer login → notification created
- Vendor login → notification created
- Admin can see all notifications
- Admin can mark as read

---

## 🚨 Troubleshooting

### Issue: "Table admin_notifications does not exist"
**Solution:** Run Step 1 (SQL script) in Supabase SQL Editor

### Issue: "Notifications menu not visible"
**Solution:** 
1. Check Vercel Root Directory = `eventverse-app`
2. Clear build cache and redeploy
3. Or test locally with `npm run dev`

### Issue: "No notifications appearing"
**Solution:**
1. Check `admin_notifications` table in Supabase (Database → Tables)
2. Verify RLS policies are correct
3. Check browser console for API errors
4. Test signup/login to trigger notifications

### Issue: "Can't mark as read"
**Solution:** 
1. Verify admin user has `role = 'admin'` in `users` table
2. Check RLS policies allow UPDATE for admins

---

## 📞 Need Help?

If you encounter issues:

1. **Check Supabase logs**: Dashboard → Logs → All logs
2. **Check Vercel logs**: Deployments → Click deployment → View logs
3. **Check browser console**: F12 → Console tab (for frontend errors)
4. **Test locally**: `cd eventverse-app && npm run dev`

---

## 🎯 Next Steps (Optional)

### Want Real Email Notifications?
See: `ADD-EMAIL-NOTIFICATIONS.md` for guide to add Resend/SendGrid

### Want SMS/Push Notifications?
Requires additional services:
- SMS: Twilio
- Push: OneSignal or Firebase

### Want Notification Preferences?
Add admin settings page to enable/disable notification types

---

**Your notification system is ready! Just run the SQL script and fix Vercel deployment.** 🚀
