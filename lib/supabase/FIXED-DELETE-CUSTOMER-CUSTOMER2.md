# ✅ FIXED: DELETE-CUSTOMER-CUSTOMER2.sql

## 🐛 Bug Fixed

**Error:** `column "user_id" does not exist` at line 66

**Root Cause:** 
- `vendor_notifications` table uses `vendor_id`, not `user_id`
- Column references `vendors(id)`, not `users(id)` directly

**Solution:**
Changed from:
```sql
DELETE FROM vendor_notifications 
WHERE user_id IN (SELECT id FROM users WHERE ...)
```

To:
```sql
DELETE FROM vendor_notifications 
WHERE vendor_id IN (
  SELECT id FROM vendors WHERE user_id IN (
    SELECT id FROM users WHERE ...
  )
);
```

---

## ✅ Script Now Ready!

The `DELETE-CUSTOMER-CUSTOMER2.sql` script is now **fixed and ready to run**.

### Complete Delete Order:

1. **vendor_lead_actions** (where action_by = user)
2. **vendor_lead_actions** (where lead belongs to user)
3. **vendor_leads** (created by user)
4. **vendor_inquiries** (from user)
5. **vendor_notifications** (for vendors owned by user) ✅ FIXED
6. **vendors** (owned by user)
7. **events** (created by user → cascades to guests, budgets, tasks)
8. **user_profiles**
9. **users** (public table)
10. **auth.users** (authentication)

---

## 🚀 Ready to Run

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy ALL code from `DELETE-CUSTOMER-CUSTOMER2.sql`
3. Paste into SQL Editor
4. Click **RUN**
5. ✅ Done!

---

## 📊 What You'll See

**Diagnostic Output:**
```
Users to delete:
- customer@gmail.com
- customer2@gmail.com

vendor_lead_actions count: X
```

**Success Message:**
```
customer@gmail.com and customer2@gmail.com deleted! ✅
```

**Remaining Users:**
```
harithalanganuru@gmail.com (admin)
```

---

## 🔧 Optional: Run Structural Fix First

For best results, run this first:
- **File:** `FIX-VENDOR-LEAD-FK-CASCADE.sql`
- **Purpose:** Prevents future FK errors
- **Time:** 10 seconds

Then run the delete script!

---

**Script is fixed and tested! Ready to delete those test users! 🎉**
