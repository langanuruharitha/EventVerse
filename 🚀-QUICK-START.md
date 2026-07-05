# 🚀 Admin Notifications - Quick Start (15 Minutes)

## Your Notification System is Ready! Just 3 Steps:

---

## STEP 1️⃣: Database (5 min)

### Go to Supabase and run this:

1. Open: **https://supabase.com/dashboard**
2. Click: **SQL Editor** → **New query**
3. **Copy and paste this script:**

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS admin_notifications CASCADE;

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

CREATE INDEX idx_admin_notifications_unread ON admin_notifications(is_read, created_at DESC);
CREATE INDEX idx_admin_notifications_type ON admin_notifications(type, created_at DESC);
CREATE INDEX idx_admin_notifications_created ON admin_notifications(created_at DESC);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notifications" ON admin_notifications
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "System can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (true);

SELECT '✅ Done!' as status;
```

4. Click: **Run**
5. See: ✅ Success message

---

## STEP 2️⃣: Vercel (5 min)

### Fix deployment settings:

1. Open: **https://vercel.com/dashboard**
2. Click: **Your EventVerse project**
3. Click: **Settings** → **General**
4. Find: **"Root Directory"**
5. Set to: `eventverse-app` ← Type this exactly
6. Click: **Save**
7. Go to: **Deployments** tab
8. Click: **Latest deployment** → **"..."** → **Redeploy**
9. Check: ☑️ **Clear Build Cache**
10. Click: **Redeploy**
11. Wait: 3-5 minutes ⏱️

---

## STEP 3️⃣: Test (5 min)

### Verify it works:

1. **Login as admin**: `harithalanganuru@gmail.com`
2. **Check sidebar**: See "Notifications 🔔" menu?
   - ✅ Yes → Continue
   - ❌ No → Wait 2 min, hard refresh (Ctrl+Shift+R)
3. **Click**: Notifications 🔔
4. **Open incognito window**
5. **Sign up** as test customer:
   - Email: `test123@gmail.com`
   - Name: `Test User`
   - Password: `Test@123`
6. **Go back to admin**
7. **Refresh** notifications page
8. **See**: 🎉 "New Customer Signup" notification!

---

## ✅ Done!

### Now You Get Notifications For:
- ✅ Every customer signup
- ✅ Every vendor signup
- ✅ Every customer login
- ✅ Every vendor login

### You Can:
- ✅ View all in `/admin/notifications`
- ✅ Filter by type (signup/login)
- ✅ Filter by status (all/unread)
- ✅ Mark as read

---

## 🚨 Troubleshooting

### Notifications menu not visible?
→ Check Vercel Root Directory = `eventverse-app`  
→ Redeploy with clear cache  
→ Hard refresh browser (Ctrl+Shift+R)

### "Table does not exist" error?
→ Run Step 1 SQL script again

### Still issues?
→ Test locally: `cd eventverse-app && npm run dev`  
→ If local works, it's Vercel config issue

---

## 📚 More Info

- Full docs: `🔔-NOTIFICATION-SYSTEM-COMPLETE-SETUP.md`
- Checklist: `✅-NOTIFICATION-CHECKLIST.md`
- Status: `📌-FINAL-STATUS-REPORT.md`

---

**Start with Step 1! It takes just 15 minutes total.** ⏱️
