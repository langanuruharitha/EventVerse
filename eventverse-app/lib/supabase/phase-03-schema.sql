-- ============================================
-- PHASE 03: MARKETPLACE & COMMERCE SYSTEM
-- EventVerse Database Schema
-- ============================================

-- ============================================
-- 1. VENDOR MARKETPLACE TABLES
-- ============================================

-- Extend vendor_profiles with business details
-- Note: Each column must be added separately with IF NOT EXISTS
DO $$ 
BEGIN
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS gst_number VARCHAR(15);
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10);
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS business_license TEXT;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS insurance_details JSONB;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "10:00", "close": "16:00"}, "sunday": {"closed": true}}'::JSONB;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS service_radius_km INT DEFAULT 50;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS minimum_booking_amount DECIMAL(10,2) DEFAULT 0.00;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS advance_percentage INT DEFAULT 30;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS portfolio_videos TEXT[];
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS social_media_links JSONB DEFAULT '{}'::JSONB;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT ARRAY['English', 'Hindi'];
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS team_size INT DEFAULT 1;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS established_year INT;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP;
  ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS verification_documents JSONB;
END $$;

-- Vendor Services
CREATE TABLE IF NOT EXISTS vendor_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  starting_price DECIMAL(10,2) NOT NULL,
  price_type VARCHAR(50) DEFAULT 'fixed', -- fixed, hourly, daily, per_guest, custom
  duration_hours INT,
  max_guests_supported INT,
  includes TEXT[],
  excludes TEXT[],
  add_ons JSONB DEFAULT '[]'::JSONB,
  seasonal_pricing JSONB,
  is_available BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendor Packages
CREATE TABLE IF NOT EXISTS vendor_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  package_name VARCHAR(255) NOT NULL,
  package_type VARCHAR(50) DEFAULT 'standard', -- basic, standard, premium, luxury, custom
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  guest_range_min INT DEFAULT 50,
  guest_range_max INT DEFAULT 200,
  services_included UUID[],
  package_highlights TEXT[],
  is_customizable BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  validity_days INT DEFAULT 30,
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendor Bookings/Inquiries
CREATE TABLE IF NOT EXISTS vendor_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  booking_type VARCHAR(50) DEFAULT 'inquiry', -- inquiry, booking, confirmed
  service_ids UUID[],
  package_id UUID REFERENCES vendor_packages(id),
  
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INT,
  venue_address TEXT,
  
  total_amount DECIMAL(12,2),
  advance_paid DECIMAL(12,2) DEFAULT 0.00,
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, advance_paid, fully_paid
  
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, rejected, cancelled, completed
  customer_message TEXT,
  vendor_response TEXT,
  response_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCT CATALOG TABLES
-- ============================================

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  icon_name VARCHAR(50),
  event_types TEXT[] DEFAULT ARRAY['birthday', 'wedding', 'anniversary', 'corporate'],
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  long_description TEXT,
  
  -- Categorization
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  event_types TEXT[] DEFAULT ARRAY['birthday', 'wedding'],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Inventory
  stock_quantity INT DEFAULT 0,
  reserved_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  track_inventory BOOLEAN DEFAULT TRUE,
  allow_backorder BOOLEAN DEFAULT FALSE,
  
  -- Product Details
  brand VARCHAR(100),
  manufacturer VARCHAR(100),
  material VARCHAR(100),
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  dimensions JSONB,
  weight DECIMAL(8,2),
  weight_unit VARCHAR(10) DEFAULT 'grams',
  
  -- Media
  primary_image_url TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  
  -- Variants
  has_variants BOOLEAN DEFAULT FALSE,
  variant_options JSONB DEFAULT '{}'::JSONB,
  
  -- Stats & SEO
  view_count INT DEFAULT 0,
  sales_count INT DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- draft, active, inactive, out_of_stock
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE NOT NULL,
  variant_name VARCHAR(255) NOT NULL,
  
  -- Variant attributes (e.g., size: M, color: Red)
  attributes JSONB NOT NULL,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  
  -- Inventory
  stock_quantity INT DEFAULT 0,
  
  -- Media
  image_url TEXT,
  
  -- Status
  is_available BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. SHOPPING CART SYSTEM
-- ============================================

-- Shopping Carts
CREATE TABLE IF NOT EXISTS shopping_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For guest carts
  
  -- Applied discounts
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  
  -- Totals
  subtotal DECIMAL(12,2) DEFAULT 0.00,
  tax_amount DECIMAL(12,2) DEFAULT 0.00,
  shipping_charges DECIMAL(12,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) DEFAULT 0.00,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, abandoned, converted
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_cart UNIQUE(user_id)
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  
  -- Flags
  is_ai_recommended BOOLEAN DEFAULT FALSE, -- Added from AI shopping list
  
  added_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_wishlist_item UNIQUE(user_id, product_id)
);

-- ============================================
-- 4. ORDER MANAGEMENT SYSTEM
-- ============================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Order Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, confirmed, processing, shipped, delivered, cancelled, returned
  payment_status VARCHAR(50) DEFAULT 'pending',
  -- pending, paid, failed, refunded, partially_refunded
  
  -- Financial Details
  subtotal DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0.00,
  coupon_code VARCHAR(50),
  shipping_charges DECIMAL(12,2) DEFAULT 0.00,
  tax_amount DECIMAL(12,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) NOT NULL,
  
  -- Delivery Information
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  delivery_instructions TEXT,
  expected_delivery_date DATE,
  
  -- Payment Information
  payment_method VARCHAR(50), -- razorpay, stripe, cod
  payment_gateway VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  payment_reference VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  
  -- Tracking
  tracking_number VARCHAR(100),
  courier_partner VARCHAR(100),
  
  -- Important Timestamps
  order_date TIMESTAMP DEFAULT NOW(),
  payment_date TIMESTAMP,
  shipped_date TIMESTAMP,
  delivered_date TIMESTAMP,
  cancelled_date TIMESTAMP,
  
  -- Notes and Reasons
  customer_notes TEXT,
  internal_notes TEXT,
  cancellation_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Product Snapshot (data at time of order)
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(50) NOT NULL,
  product_image_url TEXT,
  selected_variant JSONB,
  
  -- Pricing
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  total_price DECIMAL(12,2) NOT NULL,
  
  -- Return/Exchange
  return_eligible_until DATE,
  return_status VARCHAR(50),
  return_quantity INT DEFAULT 0,
  refund_amount DECIMAL(12,2) DEFAULT 0.00,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  
  -- Media
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Moderation
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  moderation_notes TEXT,
  
  -- Helpfulness
  helpful_count INT DEFAULT 0,
  not_helpful_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

-- Vendor indexes
CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor ON vendor_services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_services_category ON vendor_services(category);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_vendor ON vendor_packages(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_vendor ON vendor_bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_user ON vendor_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_event ON vendor_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_status ON vendor_bookings(status);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

-- Shopping cart indexes
CREATE INDEX IF NOT EXISTS idx_shopping_carts_user ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product ON wishlists(product_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_event ON orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON product_reviews(user_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(short_description, '')));
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_search ON vendor_profiles USING gin(to_tsvector('english', business_name || ' ' || COALESCE(business_description, '')));

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on new tables
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Vendor services policies
CREATE POLICY "Vendors can manage their own services" ON vendor_services
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Everyone can view active services" ON vendor_services
  FOR SELECT USING (is_available = true);

-- Product policies
CREATE POLICY "Everyone can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Cart policies
CREATE POLICY "Users can manage their own cart" ON shopping_carts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their cart items" ON cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM shopping_carts WHERE user_id = auth.uid())
  );

-- Order policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Wishlist policies
CREATE POLICY "Users can manage their wishlist" ON wishlists
  FOR ALL USING (user_id = auth.uid());

-- Review policies
CREATE POLICY "Everyone can view approved reviews" ON product_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews for their orders" ON product_reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================
-- 7. SAMPLE DATA FUNCTIONS
-- ============================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- ============================================
-- 8. VIEWS FOR REPORTING
-- ============================================

-- Product catalog view with category names
CREATE OR REPLACE VIEW product_catalog_view AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  sc.name as subcategory_name,
  (p.stock_quantity - p.reserved_quantity) as available_stock,
  CASE 
    WHEN p.stock_quantity = 0 THEN 'out_of_stock'
    WHEN p.stock_quantity <= p.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END as stock_status
FROM products p
LEFT JOIN product_categories c ON p.category_id = c.id
LEFT JOIN product_categories sc ON p.subcategory_id = sc.id;

-- Order summary view
CREATE OR REPLACE VIEW order_summary_view AS
SELECT 
  o.*,
  u.email as customer_email,
  u.email as customer_name,
  COUNT(oi.id) as total_items,
  SUM(oi.quantity) as total_quantity
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.email;

COMMENT ON TABLE vendor_services IS 'Individual services offered by vendors';
COMMENT ON TABLE vendor_packages IS 'Service packages/bundles offered by vendors';
COMMENT ON TABLE vendor_bookings IS 'Customer bookings and inquiries for vendor services';
COMMENT ON TABLE product_categories IS 'Hierarchical product categorization';
COMMENT ON TABLE products IS 'E-commerce product catalog';
COMMENT ON TABLE shopping_carts IS 'Customer shopping carts';
COMMENT ON TABLE orders IS 'Customer orders with payment and shipping details';
COMMENT ON TABLE product_reviews IS 'Customer product reviews and ratings';
