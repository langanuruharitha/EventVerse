# ✅ Admin Notifications - Setup Checklist

**Goal:** Admin gets notifications when any customer or vendor signs up or logs in.

---

## 📋 Quick Checklist

### Step 1: Database Setup
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Run: `lib/supabase/CREATE-ADMIN-NOTIFICATIONS.sql`
- [ ] Verify: See "✅ admin_notifications table created successfully!"

### Step 2: Verify Database
- [ ] Run: `lib/supabase/VERIFY-NOTIFICATIONS-SETUP.sql`
- [ ] Check: No errors, all checks pass

### Step 3: Deploy to Vercel
- [ ] Go to Vercel Dashboard
- [ ] Settings → General → Set Root Directory = `eventverse-app`
- [ ] Deployments → Redeploy (with clear cache)
- [ ] Wait for deployment success

### Step 4: Test Admin Access
- [ ] Login as admin: `harithalanganuru@gmail.com`
- [ ] Go to: `/admin/notifications`
- [ ] Verify: Page loads (not 404)
- [ ] Verify: Sidebar shows "Notifications 🔔" menu

### Step 5: Test Signup Notification
- [ ] Open site in incognito window
- [ ] Sign up as new customer (use real email for testing)
- [ ] As admin, refresh `/admin/notifications`
- [ ] Verify: See "🎉 New Customer Signup" notification

### Step 6: Test Login Notification
- [ ] Sign out from test account
- [ ] Sign in again with same credentials
- [ ] As admin, refresh `/admin/notifications`
- [ ] Verify: See "👤 User Login Notification"

### Step 7: Test Vendor Notifications
- [ ] Sign up as vendor (different email)
- [ ] As admin, check notifications
- [ ] Verify: See "🎉 New Vendor Signup"
- [ ] Login as vendor
- [ ] Verify: See "👤 User Login Notification"

### Step 8: Test Features
- [ ] Filter by: All, Unread, Signup, Login
- [ ] Mark individual notification as read
- [ ] Mark all as read (if multiple unread)
- [ ] Verify: Unread count badge updates

---

## ✅ Success Criteria

You'll know it's working when:

1. **Database:**
   - ✅ `admin_notifications` table exists
   - ✅ RLS policies configured
   - ✅ Indexes created

2. **Admin Panel:**
   - ✅ Notifications menu visible in sidebar
   - ✅ `/admin/notifications` page loads
   - ✅ Can filter and mark as read

3. **Notifications:**
   - ✅ Customer signup → admin notification
   - ✅ Vendor signup → admin notification
   - ✅ Customer login → admin notification
   - ✅ Vendor login → admin notification

---

## 🚨 If Something Doesn't Work

### Database Issues:
```sql
-- Check if table exists
SELECT * FROM admin_notifications LIMIT 1;

-- If error, run CREATE script again
```

### Deployment Issues:
1. Test locally: `cd eventverse-app && npm run dev`
2. If local works, it's Vercel config issue
3. Check Vercel Root Directory setting

### Notification Not Appearing:
1. Check browser console (F12 → Console)
2. Check Supabase logs (Dashboard → Logs)
3. Verify API endpoint exists: `/api/admin/notify-signup`

---

## 📁 Files Reference

### SQL Scripts:
- `lib/supabase/CREATE-ADMIN-NOTIFICATIONS.sql` - Create table
- `lib/supabase/VERIFY-NOTIFICATIONS-SETUP.sql` - Verify setup

### Frontend:
- `eventverse-app/app/admin/layout.tsx` - Notifications menu
- `eventverse-app/app/admin/notifications/page.tsx` - Dashboard

### Backend:
- `eventverse-app/app/api/admin/notify-signup/route.ts` - API
- `eventverse-app/lib/auth/actions.ts` - Triggers

---

## 🎯 Current Status

**ALL CODE IS READY!** Just need to:
1. Run SQL script in Supabase
2. Fix Vercel deployment (Root Directory setting)
3. Test!

---

**Once setup is complete, admin will automatically receive notifications for ALL signups and logins!** 🎉
