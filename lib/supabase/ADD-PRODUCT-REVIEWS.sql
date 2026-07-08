-- =====================================================
-- ADD PRODUCT REVIEWS - 5 REVIEWS PER PRODUCT
-- =====================================================
-- Uses existing users (admin or vendor) for reviews

-- Add 5 reviews for EACH product
INSERT INTO product_reviews (
  product_id, 
  user_id, 
  rating, 
  title,
  review_text, 
  is_verified_purchase, 
  is_approved,
  created_at
)
SELECT 
  p.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  5 as rating,
  'Excellent Product!' as title,
  'Great quality and perfect for events!' as review_text,
  true,
  true,
  NOW() - INTERVAL '30 days'
FROM products p
WHERE p.sku LIKE 'SKU-%'
UNION ALL
SELECT 
  p.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  5 as rating,
  'Worth Every Penny!' as title,
  'Exceeded our expectations. Highly recommend!' as review_text,
  true,
  true,
  NOW() - INTERVAL '25 days'
FROM products p
WHERE p.sku LIKE 'SKU-%'
UNION ALL
SELECT 
  p.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  4 as rating,
  'Very Good Quality' as title,
  'Good value for money. Will buy again.' as review_text,
  true,
  true,
  NOW() - INTERVAL '18 days'
FROM products p
WHERE p.sku LIKE 'SKU-%'
UNION ALL
SELECT 
  p.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  5 as rating,
  'Highly Recommended!' as title,
  'Perfect for our wedding. Beautiful product!' as review_text,
  true,
  true,
  NOW() - INTERVAL '12 days'
FROM products p
WHERE p.sku LIKE 'SKU-%'
UNION ALL
SELECT 
  p.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  4 as rating,
  'Happy With Purchase' as title,
  'Good quality and arrived on time.' as review_text,
  true,
  true,
  NOW() - INTERVAL '8 days'
FROM products p
WHERE p.sku LIKE 'SKU-%';

-- Verify reviews
SELECT 
  p.name,
  COUNT(pr.id) as reviews,
  ROUND(AVG(pr.rating)::numeric, 1) as avg_rating
FROM products p
LEFT JOIN product_reviews pr ON pr.product_id = p.id
WHERE p.sku LIKE 'SKU-%'
GROUP BY p.name
ORDER BY p.name;

SELECT '✅ Reviews added! Each product has 5 reviews.' as result;
