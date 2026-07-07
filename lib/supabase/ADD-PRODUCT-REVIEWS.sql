-- =====================================================
-- ADD PRODUCT REVIEWS - 5 REVIEWS PER PRODUCT
-- =====================================================
-- Run this AFTER inserting products

-- Add reviews for each product
INSERT INTO product_reviews (product_id, user_id, rating, review_text, reviewer_name, is_verified_purchase, status)
SELECT 
  p.id,
  (SELECT id FROM users WHERE email = 'harithalanganuru@gmail.com' LIMIT 1),
  ratings.rating,
  ratings.review_text,
  ratings.reviewer_name,
  true,
  'approved'
FROM products p
CROSS JOIN (
  VALUES
    (5, 'Absolutely stunning! The decorations made our wedding unforgettable. Highly recommend!', 'Priya Sharma'),
    (5, 'Best quality products! Arrived on time and looked exactly like the pictures.', 'Rahul Mehta'),
    (4, 'Great value for money. The decorations were beautiful and easy to set up.', 'Anjali Singh'),
    (5, 'Exceeded expectations! Everyone at the event loved the decorations.', 'Vikram Patel'),
    (4, 'Very good quality. Would definitely buy again for future events.', 'Meera Joshi')
) AS ratings(rating, review_text, reviewer_name)
WHERE p.sku LIKE 'SKU-%'
ON CONFLICT DO NOTHING;

-- Verify reviews were added
SELECT 
  p.name,
  p.sku,
  COUNT(pr.id) as review_count,
  AVG(pr.rating) as avg_rating,
  '✅ Reviews added!' as status
FROM products p
LEFT JOIN product_reviews pr ON pr.product_id = p.id
WHERE p.sku LIKE 'SKU-%'
GROUP BY p.id, p.name, p.sku
ORDER BY p.sku;

SELECT '✅ Product reviews added successfully!' as result;
