-- Check if venue reviews exist
SELECT COUNT(*) as total_reviews FROM venue_reviews;

-- Check reviews for specific venue (Sapphire Gardens)
SELECT 
  vr.id,
  vr.rating,
  vr.title,
  vr.review_text,
  vr.is_approved,
  v.venue_name,
  up.full_name as reviewer_name
FROM venue_reviews vr
JOIN venues v ON v.id = vr.venue_id
LEFT JOIN user_profiles up ON up.user_id = vr.user_id
WHERE v.venue_name LIKE '%Sapphire%'
ORDER BY vr.created_at DESC;

-- Check all venues with review counts
SELECT 
  v.venue_name,
  COUNT(vr.id) as review_count,
  ROUND(AVG(vr.rating)::numeric, 1) as avg_rating
FROM venues v
LEFT JOIN venue_reviews vr ON vr.venue_id = v.id AND vr.is_approved = true
GROUP BY v.venue_name
ORDER BY v.venue_name;
