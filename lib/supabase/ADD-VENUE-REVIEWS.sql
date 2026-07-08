-- =====================================================
-- ADD VENUE REVIEWS - 5 REVIEWS PER VENUE
-- =====================================================
-- Uses existing admin/vendor user for reviews

-- Add 5 reviews for EACH venue
INSERT INTO venue_reviews (
  venue_id, 
  user_id, 
  rating, 
  title,
  review_text, 
  verified_booking,
  is_approved,
  created_at
)
SELECT 
  v.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  5 as rating,
  'Perfect Venue!' as title,
  'Amazing location and beautiful ambiance. Perfect for our event!' as review_text,
  true,
  true,
  NOW() - INTERVAL '30 days'
FROM venues v
UNION ALL
SELECT 
  v.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  5 as rating,
  'Highly Recommended!' as title,
  'Excellent service and stunning venue. Will definitely book again!' as review_text,
  true,
  true,
  NOW() - INTERVAL '25 days'
FROM venues v
UNION ALL
SELECT 
  v.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  4 as rating,
  'Great Experience' as title,
  'Very good venue with all amenities. Staff was helpful.' as review_text,
  true,
  true,
  NOW() - INTERVAL '18 days'
FROM venues v
UNION ALL
SELECT 
  v.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  5 as rating,
  'Beautiful Venue!' as title,
  'Absolutely loved this place. Our guests were impressed!' as review_text,
  true,
  true,
  NOW() - INTERVAL '12 days'
FROM venues v
UNION ALL
SELECT 
  v.id,
  (SELECT id FROM users LIMIT 1) as user_id,
  4 as rating,
  'Good Value for Money' as title,
  'Nice venue with good facilities. Worth the price.' as review_text,
  true,
  true,
  NOW() - INTERVAL '8 days'
FROM venues v;

-- Update venue review counts and averages
UPDATE venues v
SET 
  total_reviews = (SELECT COUNT(*) FROM venue_reviews WHERE venue_id = v.id AND is_approved = true),
  average_rating = (SELECT COALESCE(AVG(rating), 0) FROM venue_reviews WHERE venue_id = v.id AND is_approved = true)
WHERE EXISTS (SELECT 1 FROM venue_reviews WHERE venue_id = v.id);

-- Verify reviews
SELECT 
  v.venue_name,
  COUNT(vr.id) as reviews,
  ROUND(AVG(vr.rating)::numeric, 1) as avg_rating
FROM venues v
LEFT JOIN venue_reviews vr ON vr.venue_id = v.id
GROUP BY v.venue_name
ORDER BY v.venue_name;

SELECT '✅ Venue reviews added! Each venue has 5 reviews.' as result;
