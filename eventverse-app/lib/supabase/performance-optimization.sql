-- Phase 08: Performance Optimization - Database Indexes
-- Run this script to optimize database query performance

-- ============================================================================
-- INDEX OPTIMIZATION FOR FREQUENTLY QUERIED TABLES
-- ============================================================================

-- Events table indexes
CREATE INDEX IF NOT EXISTS idx_events_user_date ON events(user_id, event_date DESC) 
WHERE status IN ('planning', 'active');

CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events(event_date, status) 
WHERE event_date >= CURRENT_DATE AND status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status, created_at DESC);

-- Vendor profiles indexes
CREATE INDEX IF NOT EXISTS idx_vendors_location_category ON vendor_profiles(business_category, average_rating DESC) 
WHERE is_active = true AND verification_status = 'approved';

CREATE INDEX IF NOT EXISTS idx_vendors_search ON vendor_profiles USING gin(to_tsvector('english', business_name || ' ' || business_description));

-- Products indexes  
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, price) 
WHERE status = 'active' AND stock_quantity > 0;

CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id, status);

CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_date ON orders(user_id, order_date DESC);

CREATE INDEX IF NOT EXISTS idx_orders_vendor ON orders(vendor_id, order_date DESC);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id) 
WHERE cart_id IS NOT NULL;

-- Guests indexes
CREATE INDEX IF NOT EXISTS idx_guests_event_rsvp ON guests(event_id, rsvp_status);

CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email) 
WHERE email IS NOT NULL;

-- Budget items indexes
CREATE INDEX IF NOT EXISTS idx_budget_event ON budget_items(event_id, category);

-- Shopping list indexes
CREATE INDEX IF NOT EXISTS idx_shopping_event_status ON shopping_list_items(event_id, is_purchased);

-- Venues indexes
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues(city, state);

CREATE INDEX IF NOT EXISTS idx_venues_capacity_price ON venues(max_capacity, price_per_day) 
WHERE is_active = true;

-- Invitations indexes
CREATE INDEX IF NOT EXISTS idx_invitations_event ON custom_invitations(event_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invitations_user ON custom_invitations(user_id, created_at DESC);

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlists(user_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist_items(product_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON reviews(vendor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating, created_at DESC);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date ON vendor_bookings(vendor_id, booking_date);

CREATE INDEX IF NOT EXISTS idx_bookings_event ON vendor_bookings(event_id, status);

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(role, is_active) 
WHERE is_active = true;

-- Platform analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_date ON platform_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_metric ON platform_analytics(metric_type, date DESC);

-- ============================================================================
-- MATERIALIZED VIEWS FOR DASHBOARD ANALYTICS
-- ============================================================================

-- Drop existing materialized view if exists
DROP MATERIALIZED VIEW IF EXISTS dashboard_analytics;

-- Create materialized view for fast dashboard queries
CREATE MATERIALIZED VIEW dashboard_analytics AS
SELECT 
  DATE_TRUNC('day', created_at)::date as date,
  COUNT(DISTINCT CASE WHEN entity_type = 'user' THEN id END) as new_users,
  COUNT(DISTINCT CASE WHEN entity_type = 'event' THEN id END) as new_events,
  COUNT(DISTINCT CASE WHEN entity_type = 'order' THEN id END) as new_orders,
  COALESCE(SUM(CASE WHEN entity_type = 'order' THEN amount ELSE 0 END), 0) as daily_revenue
FROM (
  SELECT id, 'user' as entity_type, created_at, 0 as amount FROM users
  UNION ALL
  SELECT id, 'event' as entity_type, created_at, 0 as amount FROM events
  UNION ALL  
  SELECT id, 'order' as entity_type, created_at, total_amount as amount FROM orders
) combined_data
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_dashboard_analytics_date ON dashboard_analytics(date DESC);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- EVENT STATISTICS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW event_statistics AS
SELECT 
  e.id,
  e.event_name,
  e.event_date,
  e.status,
  COUNT(DISTINCT g.id) as total_guests,
  COUNT(DISTINCT CASE WHEN g.rsvp_status = 'accepted' THEN g.id END) as confirmed_guests,
  COUNT(DISTINCT b.id) as total_budget_items,
  COALESCE(SUM(b.actual_cost), 0) as total_spent,
  e.total_budget,
  COUNT(DISTINCT s.id) as total_shopping_items,
  COUNT(DISTINCT CASE WHEN s.is_purchased = true THEN s.id END) as purchased_items,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.is_completed = true THEN t.id END) as completed_tasks
FROM events e
LEFT JOIN guests g ON g.event_id = e.id
LEFT JOIN budget_items b ON b.event_id = e.id
LEFT JOIN shopping_list_items s ON s.event_id = e.id
LEFT JOIN tasks t ON t.event_id = e.id
GROUP BY e.id, e.event_name, e.event_date, e.status, e.total_budget;

-- ============================================================================
-- VENDOR PERFORMANCE VIEW
-- ============================================================================

CREATE OR REPLACE VIEW vendor_performance AS
SELECT 
  vp.id as vendor_id,
  vp.business_name,
  vp.business_category,
  COUNT(DISTINCT vb.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN vb.status = 'completed' THEN vb.id END) as completed_bookings,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(DISTINCT r.id) as total_reviews,
  COALESCE(SUM(CASE WHEN vb.status = 'completed' THEN vb.final_amount ELSE 0 END), 0) as total_revenue
FROM vendor_profiles vp
LEFT JOIN vendor_bookings vb ON vb.vendor_id = vp.id
LEFT JOIN reviews r ON r.vendor_id = vp.id
WHERE vp.is_active = true
GROUP BY vp.id, vp.business_name, vp.business_category;

-- ============================================================================
-- QUERY OPTIMIZATION SETTINGS
-- ============================================================================

-- Analyze tables to update statistics
ANALYZE users;
ANALYZE events;
ANALYZE vendor_profiles;
ANALYZE products;
ANALYZE orders;
ANALYZE guests;
ANALYZE budget_items;
ANALYZE shopping_list_items;
ANALYZE venues;

-- ============================================================================
-- VACUUM AND MAINTENANCE
-- ============================================================================

-- Enable auto-vacuum (should be enabled by default)
-- These are informational - actual settings managed at database level

-- VACUUM ANALYZE; -- Run manually when needed for maintenance

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Performance optimization complete!';
  RAISE NOTICE '📊 Created % indexes', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
  RAISE NOTICE '🔄 Materialized views refreshed';
  RAISE NOTICE '📈 Statistics updated';
END $$;
