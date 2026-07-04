-- ============================================
-- PHASE 06: SPECIALIZED PLANNING MODULES
-- ============================================
-- Version: 1.0
-- Created: 2026-07-01
-- Description: AI-powered specialized planning modules for:
--              - Decoration Planning
--              - Food Planning
--              - Entertainment Management
--              - Rental Marketplace

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MODULE 1: AI DECORATION PLANNER
-- ============================================

-- Decoration Themes
CREATE TABLE IF NOT EXISTS decoration_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_name VARCHAR(100) NOT NULL,
  description TEXT,
  style_category VARCHAR(50), -- modern, traditional, vintage, rustic, luxury
  color_palette JSONB NOT NULL,
  -- {"primary": "#ff6b6b", "secondary": "#4ecdc4", "accent": "#45b7d1"}
  reference_images TEXT[],
  mood_board_url TEXT,
  suitable_events TEXT[], -- birthday, wedding, corporate, etc.
  cost_range_min DECIMAL(10,2),
  cost_range_max DECIMAL(10,2),
  popularity_score INT DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event Decoration Plans
CREATE TABLE IF NOT EXISTS decoration_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  theme_id UUID REFERENCES decoration_themes(id),
  plan_name VARCHAR(255),
  
  -- AI Generation Details
  ai_generated BOOLEAN DEFAULT FALSE,
  generation_prompt TEXT,
  selected_colors JSONB,
  venue_type VARCHAR(100),
  budget_range DECIMAL(10,2),
  
  -- Plan Details
  decoration_areas JSONB,
  color_scheme JSONB,
  lighting_plan JSONB,
  floral_arrangements JSONB,
  
  -- Estimates
  estimated_cost DECIMAL(12,2),
  setup_time_hours INT,
  diy_complexity VARCHAR(20), -- easy, medium, hard, expert
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, approved, in_progress, completed
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Decoration Items/Checklist
CREATE TABLE IF NOT EXISTS decoration_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES decoration_plans(id) ON DELETE CASCADE,
  
  -- Item Details
  category VARCHAR(100), -- entrance, stage, seating, ceiling, walls, floor
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 1,
  
  -- Sourcing
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  sourcing_type VARCHAR(50), -- purchase, rental, diy
  vendor_id UUID,
  product_id UUID,
  
  -- DIY Details
  diy_instructions TEXT,
  materials_needed TEXT[],
  difficulty_level VARCHAR(20),
  time_required_minutes INT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'planned',
  purchased_at TIMESTAMP,
  setup_priority INT DEFAULT 1,
  setup_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mood Boards
CREATE TABLE IF NOT EXISTS mood_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES decoration_plans(id) ON DELETE CASCADE,
  board_name VARCHAR(255),
  
  -- Board Content
  inspiration_images TEXT[],
  color_swatches JSONB,
  texture_references TEXT[],
  notes TEXT,
  
  -- Collaboration
  created_by UUID REFERENCES users(id),
  shared_with UUID[],
  is_public BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MODULE 2: FOOD PLANNING SYSTEM
-- ============================================

-- Menu Templates
CREATE TABLE IF NOT EXISTS menu_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  cuisine_type VARCHAR(100), -- indian, continental, chinese, fusion
  meal_type VARCHAR(50), -- breakfast, lunch, dinner, snacks, full_day
  dietary_type VARCHAR(50), -- veg, non_veg, vegan, jain, mixed
  
  -- Menu Structure
  menu_items JSONB NOT NULL,
  
  -- Pricing & Logistics
  cost_per_person_min DECIMAL(10,2),
  cost_per_person_max DECIMAL(10,2),
  minimum_order_quantity INT DEFAULT 50,
  preparation_time_hours INT,
  
  -- Metadata
  is_premium BOOLEAN DEFAULT FALSE,
  popularity_score INT DEFAULT 0,
  usage_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event Food Plans
CREATE TABLE IF NOT EXISTS food_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  plan_name VARCHAR(255),
  
  -- Plan Details
  guest_count INT NOT NULL,
  budget_per_person DECIMAL(10,2),
  total_budget DECIMAL(12,2),
  
  -- Dietary Requirements
  dietary_preferences JSONB,
  special_dietary_needs TEXT[],
  allergy_information TEXT[],
  
  -- Menu Selection
  selected_items JSONB,
  menu_type VARCHAR(50), -- buffet, plated, family_style, cocktail
  service_style VARCHAR(50), -- self_service, waiter_service, family_style
  
  -- Logistics
  meal_times JSONB,
  
  -- Sourcing
  caterer_id UUID,
  is_diy BOOLEAN DEFAULT FALSE,
  kitchen_requirements JSONB,
  
  -- Costs
  food_cost DECIMAL(12,2),
  service_cost DECIMAL(12,2),
  equipment_cost DECIMAL(12,2),
  total_cost DECIMAL(12,2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Food Items Catalog
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- starter, main, dessert, beverage, snack
  cuisine_type VARCHAR(100),
  dietary_tags TEXT[], -- veg, non_veg, vegan, gluten_free, dairy_free
  
  -- Item Details
  description TEXT,
  ingredients TEXT[],
  allergens TEXT[],
  
  -- Nutritional Info
  calories_per_serving INT,
  nutritional_info JSONB,
  
  -- Serving Details
  serving_size VARCHAR(50),
  serving_temperature VARCHAR(20), -- hot, cold, room_temp
  presentation_style TEXT,
  
  -- Cost & Logistics
  estimated_cost_per_serving DECIMAL(8,2),
  preparation_time_minutes INT,
  cooking_difficulty VARCHAR(20),
  
  -- Popularity & Ratings
  popularity_score INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recipe Management (for DIY)
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
  recipe_name VARCHAR(255) NOT NULL,
  
  -- Recipe Details
  ingredients JSONB NOT NULL,
  instructions TEXT NOT NULL,
  cooking_time_minutes INT,
  prep_time_minutes INT,
  difficulty_level VARCHAR(20),
  serves_count INT,
  
  -- Media
  recipe_images TEXT[],
  video_tutorial_url TEXT,
  
  -- Cost Analysis
  estimated_cost DECIMAL(10,2),
  cost_per_serving DECIMAL(8,2),
  
  -- Chef/Source Info
  chef_name VARCHAR(255),
  source_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MODULE 3: ENTERTAINMENT MANAGEMENT
-- ============================================

-- Entertainment Categories
CREATE TABLE IF NOT EXISTS entertainment_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name VARCHAR(100) NOT NULL,
  subcategories TEXT[],
  typical_duration_hours INT,
  setup_requirements TEXT[],
  equipment_needed TEXT[],
  audience_suitability TEXT[], -- kids, adults, all_ages, corporate
  created_at TIMESTAMP DEFAULT NOW()
);

-- Entertainment Bookings (extended)
CREATE TABLE IF NOT EXISTS entertainment_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  vendor_id UUID,
  category_id UUID REFERENCES entertainment_categories(id),
  
  -- Booking Details
  entertainment_type VARCHAR(100) NOT NULL,
  performer_name VARCHAR(255),
  performance_date DATE NOT NULL,
  performance_start_time TIME,
  performance_duration_minutes INT,
  
  -- Requirements
  performance_requirements JSONB,
  technical_rider_url TEXT,
  contract_terms JSONB,
  rehearsal_needed BOOLEAN DEFAULT FALSE,
  rehearsal_datetime TIMESTAMP,
  
  -- Costs
  performance_fee DECIMAL(12,2),
  travel_allowance DECIMAL(10,2),
  accommodation_required BOOLEAN DEFAULT FALSE,
  equipment_rental_cost DECIMAL(10,2),
  total_booking_cost DECIMAL(12,2),
  
  -- Status
  booking_status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance Timeline
CREATE TABLE IF NOT EXISTS performance_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Timeline Structure
  timeline_name VARCHAR(255) DEFAULT 'Entertainment Schedule',
  total_duration_minutes INT,
  
  -- Performance Slots
  performances JSONB NOT NULL,
  
  -- Technical Requirements
  sound_check_schedule JSONB,
  equipment_setup_timeline JSONB,
  
  -- Logistics
  green_room_assignments JSONB,
  artist_arrival_schedule JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Entertainment Equipment
CREATE TABLE IF NOT EXISTS entertainment_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- audio, lighting, staging, effects
  description TEXT,
  
  -- Technical Specs
  technical_specifications JSONB,
  power_requirements VARCHAR(100),
  setup_complexity VARCHAR(20), -- easy, medium, complex
  operator_required BOOLEAN DEFAULT FALSE,
  
  -- Rental Details
  rental_price_per_day DECIMAL(10,2),
  delivery_charges DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  
  -- Availability
  total_inventory INT DEFAULT 1,
  available_inventory INT DEFAULT 1,
  
  -- Media
  equipment_images TEXT[],
  manual_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MODULE 4: RENTAL MARKETPLACE
-- ============================================

-- Rental Categories
CREATE TABLE IF NOT EXISTS rental_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name VARCHAR(100) NOT NULL,
  parent_category_id UUID REFERENCES rental_categories(id),
  description TEXT,
  typical_rental_duration VARCHAR(50), -- hourly, daily, weekly, event_duration
  requires_delivery BOOLEAN DEFAULT TRUE,
  requires_setup BOOLEAN DEFAULT FALSE,
  security_deposit_percentage DECIMAL(5,2) DEFAULT 20.00,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rental Items
CREATE TABLE IF NOT EXISTS rental_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES rental_categories(id),
  vendor_id UUID,
  
  -- Item Details
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100),
  model VARCHAR(100),
  year_manufactured INT,
  condition_rating VARCHAR(20), -- excellent, good, fair
  
  -- Rental Pricing
  price_per_day DECIMAL(10,2) NOT NULL,
  price_per_week DECIMAL(10,2),
  price_per_month DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  
  -- Logistics
  delivery_charges DECIMAL(10,2),
  setup_charges DECIMAL(10,2),
  delivery_radius_km INT DEFAULT 50,
  
  -- Discounts
  bulk_discount_tiers JSONB,
  
  -- Availability
  total_inventory INT DEFAULT 1,
  available_inventory INT DEFAULT 1,
  
  -- Additional Info
  maintenance_schedule JSONB,
  insurance_value DECIMAL(12,2),
  replacement_cost DECIMAL(12,2),
  rental_terms JSONB,
  
  -- Media
  item_images TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rental Orders
CREATE TABLE IF NOT EXISTS rental_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  item_id UUID REFERENCES rental_items(id),
  vendor_id UUID,
  
  -- Order Details
  quantity INT NOT NULL DEFAULT 1,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE NOT NULL,
  rental_duration_days INT,
  
  -- Pricing
  item_cost DECIMAL(12,2),
  delivery_cost DECIMAL(10,2),
  setup_cost DECIMAL(10,2),
  insurance_cost DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  total_cost DECIMAL(12,2),
  
  -- Logistics
  delivery_instructions TEXT,
  setup_instructions TEXT,
  event_timeline_integration JSONB,
  
  -- Insurance & Waivers
  damage_waiver_signed BOOLEAN DEFAULT FALSE,
  insurance_opted BOOLEAN DEFAULT FALSE,
  
  -- Charges
  late_return_charges DECIMAL(10,2),
  cleaning_charges DECIMAL(10,2),
  
  -- Status
  order_status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Delivery & Logistics
CREATE TABLE IF NOT EXISTS rental_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES rental_orders(id) ON DELETE CASCADE,
  
  -- Delivery Details
  delivery_type VARCHAR(50), -- standard, express, white_glove
  delivery_date DATE NOT NULL,
  delivery_time_slot VARCHAR(50), -- morning, afternoon, evening
  delivery_address JSONB NOT NULL,
  delivery_contact_name VARCHAR(255),
  delivery_contact_phone VARCHAR(20),
  
  -- Pickup Details
  pickup_date DATE NOT NULL,
  pickup_time_slot VARCHAR(50),
  pickup_instructions TEXT,
  
  -- Logistics
  assigned_driver_id UUID,
  delivery_vehicle_type VARCHAR(50),
  estimated_travel_time INT, -- in minutes
  
  -- Status Tracking
  delivery_status VARCHAR(50) DEFAULT 'scheduled',
  delivered_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  
  -- Condition Reports
  delivery_condition_report JSONB,
  pickup_condition_report JSONB,
  damage_notes TEXT,
  damage_photos TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Decoration Indexes
CREATE INDEX IF NOT EXISTS idx_decoration_themes_style ON decoration_themes(style_category);
CREATE INDEX IF NOT EXISTS idx_decoration_plans_event ON decoration_plans(event_id);
CREATE INDEX IF NOT EXISTS idx_decoration_items_plan ON decoration_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_mood_boards_plan ON mood_boards(plan_id);

-- Food Planning Indexes
CREATE INDEX IF NOT EXISTS idx_menu_templates_event_type ON menu_templates(event_type);
CREATE INDEX IF NOT EXISTS idx_food_plans_event ON food_plans(event_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category);
CREATE INDEX IF NOT EXISTS idx_recipes_food_item ON recipes(food_item_id);

-- Entertainment Indexes
CREATE INDEX IF NOT EXISTS idx_entertainment_bookings_event ON entertainment_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_performance_timeline_event ON performance_timeline(event_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_equipment_category ON entertainment_equipment(category);

-- Rental Indexes
CREATE INDEX IF NOT EXISTS idx_rental_items_category ON rental_items(category_id);
CREATE INDEX IF NOT EXISTS idx_rental_orders_event ON rental_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_rental_deliveries_order ON rental_deliveries(order_id);


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE decoration_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entertainment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entertainment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE entertainment_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_deliveries ENABLE ROW LEVEL SECURITY;

-- Decoration themes - readable by all
CREATE POLICY "Decoration themes readable by all" ON decoration_themes
  FOR SELECT USING (true);

-- Decoration plans - only event owner
CREATE POLICY "Decoration plans accessible by event owner" ON decoration_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Decoration items - only event owner
CREATE POLICY "Decoration items accessible by event owner" ON decoration_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM decoration_plans dp
      JOIN events e ON e.id = dp.event_id
      WHERE dp.id = plan_id AND e.user_id = auth.uid()
    )
  );

-- Mood boards - creator or shared users
CREATE POLICY "Mood boards accessible by creator and shared users" ON mood_boards
  FOR ALL USING (
    auth.uid() = created_by OR 
    auth.uid() = ANY(shared_with) OR
    is_public = true
  );

-- Menu templates - readable by all
CREATE POLICY "Menu templates readable by all" ON menu_templates
  FOR SELECT USING (true);

-- Food plans - only event owner
CREATE POLICY "Food plans accessible by event owner" ON food_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Food items - readable by all
CREATE POLICY "Food items readable by all" ON food_items
  FOR SELECT USING (true);

-- Recipes - readable by all
CREATE POLICY "Recipes readable by all" ON recipes
  FOR SELECT USING (true);

-- Entertainment categories - readable by all
CREATE POLICY "Entertainment categories readable by all" ON entertainment_categories
  FOR SELECT USING (true);

-- Entertainment bookings - only event owner
CREATE POLICY "Entertainment bookings accessible by event owner" ON entertainment_bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Performance timeline - only event owner
CREATE POLICY "Performance timeline accessible by event owner" ON performance_timeline
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Entertainment equipment - readable by all
CREATE POLICY "Entertainment equipment readable by all" ON entertainment_equipment
  FOR SELECT USING (true);

-- Rental categories - readable by all
CREATE POLICY "Rental categories readable by all" ON rental_categories
  FOR SELECT USING (true);

-- Rental items - readable by all
CREATE POLICY "Rental items readable by all" ON rental_items
  FOR SELECT USING (is_active = true);

-- Rental orders - only event owner
CREATE POLICY "Rental orders accessible by event owner" ON rental_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Rental deliveries - only order owner
CREATE POLICY "Rental deliveries accessible by order owner" ON rental_deliveries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rental_orders ro
      JOIN events e ON e.id = ro.event_id
      WHERE ro.id = order_id AND e.user_id = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate rental duration
CREATE OR REPLACE FUNCTION calculate_rental_duration()
RETURNS TRIGGER AS $$
BEGIN
  NEW.rental_duration_days = (NEW.rental_end_date - NEW.rental_start_date) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate rental duration
CREATE TRIGGER trigger_calculate_rental_duration
BEFORE INSERT OR UPDATE ON rental_orders
FOR EACH ROW
EXECUTE FUNCTION calculate_rental_duration();

-- ============================================
-- SAMPLE DATA FOR DECORATION THEMES
-- ============================================

INSERT INTO decoration_themes (theme_name, description, style_category, color_palette, suitable_events, cost_range_min, cost_range_max, popularity_score) VALUES
('Royal Elegance', 'Luxurious theme with gold and deep purple accents', 'luxury', 
 '{"primary": "#4B0082", "secondary": "#FFD700", "accent": "#FFFFFF", "highlight": "#8B008B"}'::jsonb, 
 ARRAY['wedding', 'anniversary', 'corporate'], 50000, 200000, 85),

('Modern Minimalist', 'Clean lines with neutral palette and greenery', 'modern',
 '{"primary": "#FFFFFF", "secondary": "#2E7D32", "accent": "#9E9E9E", "highlight": "#000000"}'::jsonb,
 ARRAY['corporate', 'engagement', 'birthday'], 20000, 80000, 92),

('Vintage Romance', 'Soft pastels with vintage elements and lace', 'vintage',
 '{"primary": "#FFB6C1", "secondary": "#FFF5EE", "accent": "#DDA0DD", "highlight": "#F5DEB3"}'::jsonb,
 ARRAY['wedding', 'anniversary', 'bridal_shower'], 30000, 120000, 78),

('Rustic Charm', 'Natural wood, burlap, and wildflowers', 'rustic',
 '{"primary": "#8B4513", "secondary": "#F5DEB3", "accent": "#2E8B57", "highlight": "#FFFACD"}'::jsonb,
 ARRAY['wedding', 'birthday', 'outdoor_events'], 25000, 100000, 88);


-- ============================================
-- SAMPLE DATA FOR MENU TEMPLATES
-- ============================================

INSERT INTO menu_templates (template_name, event_type, cuisine_type, meal_type, dietary_type, menu_items, cost_per_person_min, cost_per_person_max, popularity_score) VALUES
('Classic Indian Wedding Buffet', 'wedding', 'indian', 'full_day', 'mixed',
 '{"welcome_drinks": ["Masala Chai", "Fresh Lime Soda"], "starters": ["Paneer Tikka", "Chicken Tikka", "Veg Spring Rolls", "Fish Pakora"], "mains": ["Dal Makhani", "Paneer Butter Masala", "Chicken Curry", "Biryani", "Roti", "Naan"], "desserts": ["Gulab Jamun", "Rasmalai", "Ice Cream"]}'::jsonb,
 500, 1200, 95),

('Corporate Lunch Package', 'corporate', 'multi', 'lunch', 'mixed',
 '{"starters": ["Garden Salad", "Soup of the Day"], "mains": ["Grilled Chicken", "Veg Pasta", "Rice", "Roti"], "desserts": ["Fresh Fruit Platter", "Cookies"], "beverages": ["Coffee", "Tea", "Soft Drinks"]}'::jsonb,
 300, 600, 88),

('Birthday Party Kids Menu', 'birthday', 'continental', 'snacks', 'veg',
 '{"snacks": ["Pizza", "Pasta", "French Fries", "Sandwiches"], "desserts": ["Birthday Cake", "Cupcakes", "Ice Cream"], "beverages": ["Fruit Juices", "Soft Drinks", "Milkshakes"]}'::jsonb,
 250, 500, 90),

('Elegant Anniversary Dinner', 'anniversary', 'fusion', 'dinner', 'mixed',
 '{"starters": ["Bruschetta", "Soup", "Salad"], "mains": ["Grilled Fish", "Roast Chicken", "Vegetable Lasagna", "Garlic Bread"], "desserts": ["Chocolate Mousse", "Tiramisu"], "beverages": ["Wine", "Mocktails"]}'::jsonb,
 800, 1500, 82);

-- ============================================
-- PHASE 06 SCHEMA COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this schema in Supabase SQL Editor
-- 2. Verify all tables and indexes are created
-- 3. Test RLS policies
-- 4. Implement AI decoration generator
-- 5. Build frontend components for all modules
-- 6. Create API routes for data management

