# 🔧 Fix: Vendor Signup Redirects to Customer Portal

## Problem
When users select "Vendor" during signup, they still get redirected to the customer portal instead of the vendor dashboard.

---

## 🎯 Root Causes

### Issue #1: Signup Page Doesn't Auto-Redirect
After signup, users see a success message but aren't redirected to sign in. They have to manually click "Sign In".

### Issue #2: Database Role Mismatch
Sometimes the role selected during signup doesn't get saved correctly in the `users` table, even though it's saved in `auth.users.raw_user_meta_data`.

---

## ✅ Solution

### STEP 1: Fix Existing Vendor Accounts (Database)

**Open Supabase Dashboard** → **SQL Editor** → **Run This:**

```sql
-- Fix users who signed up as vendor but got customer role
UPDATE users u
SET role = au.raw_user_meta_data->>'role'
FROM auth.users au
WHERE u.id = au.id
  AND au.raw_user_meta_data->>'role' = 'vendor'
  AND u.role != 'vendor';

-- Verify the fix
SELECT 
  u.email,
  u.role,
  au.raw_user_meta_data->>'role' as signup_role,
  CASE 
    WHEN u.role = 'vendor' AND au.raw_user_meta_data->>'role' = 'vendor' 
    THEN '✅ Correct - Will go to vendor dashboard'
    WHEN u.role = 'customer' 
    THEN '✅ Correct - Will go to customer dashboard'
    WHEN u.role = 'admin' 
    THEN '✅ Correct - Will go to admin dashboard'
    ELSE '❌ Mismatch'
  END as redirect_status
FROM users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC;
```

Click **Run** → Verify vendors now have `role = 'vendor'`

---

### STEP 2: Update Code (Already Done!)

I've updated the signup page to automatically redirect users to the sign-in page after successful signup.

**File Updated:** `eventverse-app/app/auth/signup/page.tsx`

**Changes:**
- Added `useRouter` to handle redirects
- After successful signup, automatically redirects to `/auth/signin` after 2 seconds
- Users no longer need to manually click "Sign In"

---

### STEP 3: Deploy Updated Code

**Option A: Push to GitHub and Deploy via Vercel**

```bash
cd "c:\Users\Admin\OneDrive\ドキュメント\Eventverse"
git add .
git commit -m "Fix: Auto-redirect after signup and fix vendor role issues"
git push origin main
```

Then Vercel will automatically deploy (wait 3-5 minutes)

**Option B: Manual Vercel Redeploy**

1. Go to: https://vercel.com/dashboard
2. Click: Your EventVerse project
3. Click: Deployments
4. Click: Latest deployment → "..." → Redeploy
5. Check: ☑️ Clear Build Cache
6. Wait: 3-5 minutes

---

## 🧪 How to Test

### Test 1: New Vendor Signup

1. **Open incognito window**
2. **Go to:** `/auth/signup`
3. **Fill form:**
   - Name: `Test Vendor`
   - Email: `testvendor@example.com`
   - Password: `Test@123`
   - **Select: Vendor** ⭐ (Important!)
4. **Click: Sign Up**
5. **Wait 2 seconds** → Should auto-redirect to `/auth/signin`
6. **Sign in** with the same credentials
7. **Should redirect to:** `/vendor/dashboard` ✅ (NOT `/dashboard`)

### Test 2: Existing Vendor Account

If you already have a vendor account that's going to customer portal:

1. **Run the SQL script** in STEP 1 (fixes database role)
2. **Sign out** completely
3. **Sign in** again
4. **Should now redirect to:** `/vendor/dashboard` ✅

### Test 3: Customer Signup (Verify Still Works)

1. **Open incognito window**
2. **Sign up as Customer** (not vendor)
3. **Sign in**
4. **Should redirect to:** `/dashboard` ✅

---

## 📊 How It Works Now

### Signup Flow:
```
User fills signup form
  ↓
Selects "Vendor" role
  ↓
Clicks "Sign Up"
  ↓
Account created with role = 'vendor' in auth.users
  ↓
Database trigger copies to public.users with role = 'vendor'
  ↓
Success message shows for 2 seconds
  ↓
Auto-redirect to /auth/signin
  ↓
User signs in
  ↓
signIn() function checks role in database
  ↓
If role = 'vendor' → redirect to /vendor/dashboard ✅
If role = 'customer' → redirect to /dashboard ✅
If role = 'admin' → redirect to /admin/dashboard ✅
```

---

## 🚨 Troubleshooting

### Issue: Still redirecting to customer portal after fix

**Check #1: Verify role in database**
```sql
SELECT email, role FROM users WHERE email = 'your-vendor-email@example.com';
```

Expected: `role = 'vendor'`

If not: Run the SQL fix in STEP 1 again

**Check #2: Clear browser cache and sign out**
1. Sign out completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Close browser
4. Open browser again
5. Sign in again

**Check #3: Verify auth metadata**
```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as metadata_role
FROM auth.users 
WHERE email = 'your-vendor-email@example.com';
```

Expected: `metadata_role = 'vendor'`

**Check #4: Test with NEW vendor account**
Sometimes cached sessions cause issues. Create a brand new vendor account to test.

---

### Issue: Signup page not auto-redirecting

**Problem:** Code not deployed yet

**Solution:**
1. Wait for Vercel deployment to finish (check dashboard)
2. Or test locally: `cd eventverse-app && npm run dev`
3. Hard refresh browser: Ctrl+Shift+R

---

## ✅ Expected Results

After applying this fix:

### ✅ Vendor Signup:
- Sign up as vendor → Auto-redirect to sign in → Sign in → **Vendor dashboard** ✅

### ✅ Customer Signup:
- Sign up as customer → Auto-redirect to sign in → Sign in → **Customer dashboard** ✅

### ✅ Admin Login:
- Sign in as admin → **Admin dashboard** ✅

### ✅ Role Persistence:
- Role selected during signup is saved correctly
- Role persists across sessions
- Redirects work consistently

---

## 📁 Files Modified

1. ✅ `eventverse-app/app/auth/signup/page.tsx` - Added auto-redirect after signup
2. ✅ `lib/supabase/FIX-VENDOR-ROLES.sql` - SQL script to fix existing accounts

---

## 🎯 Summary

**Problem:** Vendors redirected to customer portal
**Cause:** Role not syncing correctly + No auto-redirect after signup
**Solution:** 
1. SQL script to fix existing vendor accounts
2. Updated signup page to auto-redirect
3. Existing signIn logic already handles role-based redirects correctly

**Time to fix:** 5 minutes (run SQL + deploy)

---

## 📞 Next Steps

1. ✅ Run SQL script in STEP 1 (fixes existing accounts)
2. ✅ Push code to GitHub or redeploy in Vercel
3. ✅ Test with new vendor signup
4. ✅ Test with existing vendor account
5. ✅ Verify customer signups still work

**Start with STEP 1 (run the SQL script)!** 🚀
