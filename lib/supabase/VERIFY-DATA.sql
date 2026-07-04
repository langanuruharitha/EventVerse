-- Run this query in Supabase to verify data was inserted

-- Check product categories
SELECT 'Product Categories' as table_name, COUNT(*) as count FROM product_categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Active Products', COUNT(*) FROM products WHERE status = 'active';

-- Show category details
SELECT 
  name, 
  slug, 
  event_types,
  is_active
FROM product_categories
ORDER BY display_order;

-- Show products per event type
SELECT 
  UNNEST(event_types) as event_type,
  COUNT(*) as product_count
FROM products
WHERE status = 'active'
GROUP BY event_type
ORDER BY event_type;

-- Show sample products
SELECT 
  sku,
  name,
  event_types,
  price,
  status
FROM products
LIMIT 10;
