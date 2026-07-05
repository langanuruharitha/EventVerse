# 🔔 Setup Admin Notifications - Quick Guide

## ✅ What This Does

When someone signs up or logs in as customer/vendor, you (admin) will get notified!

---

## 🚀 Setup (3 Steps)

### Step 1: Create Database Table
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**
2. Open: `lib/supabase/CREATE-ADMIN-NOTIFICATIONS.sql`
3. Copy ALL code
4. Paste in SQL Editor
5. Click **RUN**
6. ✅ Wait for success message

---

### Step 2: Deploy to Vercel
```bash
git add .
git commit -m "Add admin notifications for signups and logins"
git push
```

Vercel will auto-deploy! ✅

---

### Step 3: Check Notifications
1. Test: Someone signs up as customer/vendor
2. Login to admin panel
3. Click **Notifications 🔔** in sidebar
4. See the notification! 🎉

---

## 📱 What You'll See

### In Admin Panel `/admin/notifications`:
- 🎉 New customer/vendor signups
- 👤 User logins
- 📧 User email, name, role
- ⏰ Timestamp
- ✅ Mark as read feature

---

## 🎯 Example Notification

```
🎉 New Customer Signup - EventVerse

📋 User Details:
• Name: John Doe
• Email: john@example.com
• Role: Customer
• Date: 1/5/2026, 2:30:45 PM
```

---

## 📋 Files Added

- ✅ `app/admin/notifications/page.tsx` - Notifications page
- ✅ `app/api/admin/notify-signup/route.ts` - API route
- ✅ `lib/supabase/CREATE-ADMIN-NOTIFICATIONS.sql` - Database table
- ✅ Updated `lib/auth/actions.ts` - Added notifications
- ✅ Updated `app/admin/layout.tsx` - Added menu item

---

## 🆘 Troubleshooting

**No notifications showing?**
- Check that you ran the SQL script
- Verify deployment is complete
- Try signing up with a test account

**Notifications not in real-time?**
- Currently stores in database only
- Refresh page to see new notifications
- For emails: Need to add email service (see full guide)

---

## 📧 Want Real Emails?

See: `ADMIN-NOTIFICATIONS-SETUP.md` for instructions to add email sending with Resend/SendGrid

---

**Ready to start? Run the SQL script and deploy!** 🚀
