-- =====================================================
-- CHECK PRODUCT REVIEWS STATUS
-- =====================================================

-- Check if reviews exist
SELECT 
  COUNT(*) as total_reviews,
  COUNT(DISTINCT product_id) as products_with_reviews,
  AVG(rating) as average_rating
FROM product_reviews;

-- Check reviews per product
SELECT 
  p.name as product_name,
  COUNT(pr.id) as review_count,
  AVG(pr.rating) as avg_rating
FROM products p
LEFT JOIN product_reviews pr ON pr.product_id = p.id
GROUP BY p.id, p.name
ORDER BY review_count DESC
LIMIT 10;

-- Check RLS policies for product_reviews
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'product_reviews';

-- Check if product_reviews table has RLS enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables 
WHERE tablename = 'product_reviews';

-- Sample reviews
SELECT 
  pr.rating,
  pr.review_text,
  pr.is_approved,
  p.name as product_name,
  pr.created_at
FROM product_reviews pr
JOIN products p ON p.id = pr.product_id
ORDER BY pr.created_at DESC
LIMIT 5;
