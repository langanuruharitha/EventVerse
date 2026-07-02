-- ============================================
-- EVENTVERSE COMPLETE DATABASE SETUP
-- Run this file to set up the entire database
-- ============================================

-- WARNING: This will DROP existing tables!
-- Make sure to backup if you have data!

-- ============================================
-- PHASE 02: EVENT PLANNING SCHEMA
-- ============================================

-- Drop tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS event_shopping_items CASCADE;
DROP TABLE IF EXISTS event_timeline CASCADE;
DROP TABLE IF EXISTS event_tasks CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_types CASCADE;

-- Event Types
CREATE TABLE event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INTEGER,
  total_budget DECIMAL(12,2),
  theme TEXT,
  venue_types TEXT[],
  location_preference TEXT,
  event_timing TEXT CHECK (event_timing IN ('morning', 'afternoon', 'evening', 'full_day')),
  color_scheme TEXT[],
  special_requirements TEXT,
  selected_addons TEXT[],
  ai_blueprint JSONB,
  ai_model_version TEXT,
  ai_generation_time_ms INTEGER,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event Tasks
CREATE TABLE event_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  task_name TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event Timeline
CREATE TABLE event_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  milestone_date DATE NOT NULL,
  description TEXT,
  category TEXT,
  is_completed BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Event Shopping Items
CREATE TABLE event_shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  estimated_price DECIMAL(10,2),
  actual_price DECIMAL(10,2),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  is_purchased BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ,
  purchase_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Interactions
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  input_data JSONB,
  ai_response JSONB,
  model_version TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Event Types
INSERT INTO event_types (name, slug, description, icon_name, display_order, is_active) VALUES
('Birthday', 'birthday', 'Birthday parties and celebrations', '🎂', 1, true),
('Wedding', 'wedding', 'Wedding ceremonies and receptions', '💍', 2, true),
('Anniversary', 'anniversary', 'Anniversary celebrations', '💐', 3, true),
('Baby Shower', 'baby_shower', 'Baby shower and gender reveal parties', '👶', 4, true),
('Corporate Event', 'corporate', 'Corporate events and business gatherings', '🏢', 5, true),
('Engagement', 'engagement', 'Engagement parties and celebrations', '💝', 6, true);

-- ============================================
-- PHASE 03: COMMERCE SCHEMA
-- ============================================

-- Drop commerce tables
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;

-- Product Categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  image_url TEXT,
  event_types TEXT[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  long_description TEXT,
  category_id UUID REFERENCES product_categories(id),
  event_types TEXT[],
  tags TEXT[],
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  cost_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  brand TEXT,
  colors TEXT[],
  sizes TEXT[],
  dimensions JSONB,
  weight DECIMAL(10,3),
  primary_image_url TEXT,
  images TEXT[],
  rating_average DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shopping Cart
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_color TEXT,
  selected_size TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id, selected_color, selected_size)
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  shipping_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image_url TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  selected_color TEXT,
  selected_size TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CREATE VIEWS
-- ============================================

DROP VIEW IF EXISTS event_overview;
CREATE VIEW event_overview AS
SELECT 
  e.*,
  COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN s.is_purchased = true THEN s.id END) as purchased_items,
  COUNT(DISTINCT s.id) as total_shopping_items,
  COALESCE(SUM(s.actual_price), 0) as spent_amount,
  e.total_budget - COALESCE(SUM(s.actual_price), 0) as remaining_budget,
  EXTRACT(DAY FROM (e.event_date::TIMESTAMP - CURRENT_DATE::TIMESTAMP)) as days_until_event,
  CASE 
    WHEN COUNT(DISTINCT t.id) = 0 THEN 100
    ELSE ROUND((COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END)::DECIMAL / COUNT(DISTINCT t.id)) * 100)
  END as health_score
FROM events e
LEFT JOIN event_tasks t ON e.id = t.event_id
LEFT JOIN event_shopping_items s ON e.id = s.event_id
GROUP BY e.id;

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_tasks_event_id ON event_tasks(event_id);
CREATE INDEX idx_shopping_event_id ON event_shopping_items(event_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_event_types ON products USING gin(event_types);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- ============================================
-- SEED PRODUCT CATEGORIES
-- ============================================

INSERT INTO product_categories (name, slug, description, event_types, display_order, is_active) VALUES
('Balloons', 'balloons', 'Party balloons and balloon decorations', ARRAY['birthday', 'wedding', 'baby_shower', 'anniversary', 'corporate'], 1, true),
('Decorations', 'decorations', 'Party decorations and decor items', ARRAY['birthday', 'wedding', 'baby_shower', 'anniversary', 'corporate'], 2, true),
('Tableware', 'tableware', 'Plates, cups, napkins and table items', ARRAY['birthday', 'wedding', 'baby_shower', 'anniversary', 'corporate'], 3, true),
('Clothing', 'clothing', 'Event clothing and attire', ARRAY['wedding', 'baby_shower', 'anniversary', 'birthday'], 4, true),
('Jewelry', 'jewelry', 'Jewelry and accessories', ARRAY['wedding', 'anniversary', 'birthday'], 5, true),
('Decor', 'decor', 'Decor items and accessories', ARRAY['corporate', 'wedding', 'birthday', 'baby_shower', 'anniversary'], 6, true),
('Return Gifts', 'return-gifts', 'Return gifts and party favors', ARRAY['birthday', 'wedding', 'baby_shower', 'anniversary', 'corporate'], 7, true);

-- ============================================
-- READY TO USE
-- ============================================
-- Database setup complete!
-- Next step: Run FINAL-EXACT-IMAGES.sql to populate products
-- ============================================
