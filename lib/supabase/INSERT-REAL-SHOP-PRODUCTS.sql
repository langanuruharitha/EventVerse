-- =====================================================
-- INSERT REAL SHOP PRODUCTS WITH UNSPLASH IMAGES
-- =====================================================
-- All images from Unsplash.com (Free for commercial use)
-- Run this script in Supabase SQL Editor

-- First, ensure product_categories exist
INSERT INTO product_categories (name, slug, description, icon_name, is_active, display_order, parent_id)
VALUES
  ('Decorations', 'decorations', 'Event decorations and decor items', '🎨', true, 1, NULL),
  ('Cake Decorations', 'cake-decorations', 'Cake toppers, candles, and accessories', '🎂', true, 2, NULL),
  ('Photo Booth', 'photo-booth', 'Photo booth props and accessories', '📸', true, 3, NULL),
  ('Flowers', 'flowers', 'Fresh and artificial flowers', '💐', true, 4, NULL),
  ('Accessories', 'accessories', 'Event accessories and supplies', '✨', true, 5, NULL),
  ('Party Supplies', 'party-supplies', 'Party essentials and supplies', '🎉', true, 6, NULL),
  ('Banners', 'banners', 'Event banners and signage', '🏷️', true, 7, NULL),
  ('Lighting', 'lighting', 'Event lighting and decorative lights', '💡', true, 8, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name;

-- Clear existing products (optional - remove this line if you want to keep existing data)
-- TRUNCATE products CASCADE;

-- Insert Wedding Products
INSERT INTO products (
  name, slug, category, event_types, price, original_price, discount_percentage,
  primary_image, additional_images, description, short_description,
  stock_quantity, in_stock, rating_average, review_count, sales_count,
  is_featured, is_bestseller, tags, status
) VALUES
(
  'Premium Wedding Decoration Package - Flowers & Drapes',
  'premium-wedding-decoration-flowers-drapes',
  'Decorations',
  ARRAY['wedding', 'engagement'],
  15999,
  22999,
  30,
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    'https://images.unsplash.com/photo-1525258974266-5bea8e41e588?w=800'
  ],
  'Transform your wedding venue with our premium decoration package featuring elegant floral arrangements, flowing drapes, and ambient lighting. Includes fresh flower bouquets, table centerpieces, backdrop setup, and professional installation.',
  'Complete wedding decoration with flowers, drapes & lighting',
  25,
  true,
  4.8,
  156,
  342,
  true,
  true,
  ARRAY['wedding', 'flowers', 'decorations', 'premium', 'bestseller'],
  'active'
),
(
  'Elegant Bride & Groom Cake Topper Set',
  'elegant-bride-groom-cake-topper',
  'Cake Decorations',
  ARRAY['wedding'],
  899,
  1299,
  31,
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop',
  NULL,
  'Beautiful handcrafted cake topper featuring bride and groom figurines. Made from premium materials with intricate detailing. Perfect keepsake for your special day.',
  'Handcrafted wedding cake topper',
  150,
  true,
  4.9,
  89,
  567,
  true,
  true,
  ARRAY['wedding', 'cake', 'topper', 'decoration'],
  'active'
),
(
  'Wedding Photo Booth Props Kit (25 Pieces)',
  'wedding-photo-booth-props-kit',
  'Photo Booth',
  ARRAY['wedding', 'engagement'],
  1499,
  NULL,
  0,
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
  NULL,
  'Make your wedding photos memorable with our 25-piece photo booth props kit. Includes funny glasses, mustaches, speech bubbles, and themed signs.',
  '25 fun photo booth props for wedding',
  80,
  true,
  4.7,
  124,
  289,
  true,
  false,
  ARRAY['wedding', 'photo booth', 'props', 'entertainment'],
  'active'
),
(
  'Luxury Wedding Flower Bouquet - Mixed Roses',
  'luxury-wedding-flower-bouquet-roses',
  'Flowers',
  ARRAY['wedding'],
  2499,
  NULL,
  0,
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop',
  NULL,
  'Stunning bridal bouquet featuring premium mixed roses in white, pink, and cream. Hand-tied with satin ribbon. Fresh flowers delivered on your wedding day.',
  'Premium rose bridal bouquet',
  40,
  true,
  5.0,
  78,
  234,
  true,
  true,
  ARRAY['wedding', 'flowers', 'bouquet', 'roses'],
  'active'
),
(
  'Wedding Ring Bearer Pillow - Ivory Lace',
  'wedding-ring-bearer-pillow-ivory',
  'Accessories',
  ARRAY['wedding'],
  699,
  NULL,
  0,
  'https://images.unsplash.com/photo-1535424263334-b570d6c9f32a?w=800&auto=format&fit=crop',
  NULL,
  'Beautiful ivory lace ring bearer pillow with pearl embellishments. Elegant design perfect for traditional or modern weddings.',
  'Ivory lace ring bearer pillow',
  95,
  true,
  4.8,
  45,
  178,
  false,
  false,
  ARRAY['wedding', 'rings', 'accessories'],
  'active'
);

-- Insert Birthday Products
INSERT INTO products (
  name, slug, category, event_types, price, original_price, discount_percentage,
  primary_image, description, short_description,
  stock_quantity, in_stock, rating_average, review_count, sales_count,
  is_featured, is_bestseller, tags, status
) VALUES
(
  'Birthday Balloon Decoration Set - 50 Pieces (Multi-Color)',
  'birthday-balloon-decoration-set-50pcs',
  'Decorations',
  ARRAY['birthday'],
  799,
  1199,
  33,
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
  'Complete birthday balloon decoration set with 50 colorful balloons including latex balloons, foil number balloons, and confetti balloons. Perfect for all ages!',
  '50-piece colorful balloon decoration set',
  200,
  true,
  4.6,
  312,
  892,
  true,
  true,
  ARRAY['birthday', 'balloons', 'decorations', 'colorful', 'bestseller'],
  'active'
),
(
  'Happy Birthday Banner & Bunting Set - Gold Rose',
  'happy-birthday-banner-bunting-gold-rose',
  'Decorations',
  ARRAY['birthday'],
  449,
  NULL,
  0,
  'https://images.unsplash.com/photo-1464198016405-ee304365c3b7?w=800&auto=format&fit=crop',
  'Elegant gold and rose gold happy birthday banner with matching bunting flags. Reusable and perfect for Instagram-worthy celebrations.',
  'Gold rose birthday banner set',
  175,
  true,
  4.7,
  189,
  456,
  true,
  false,
  ARRAY['birthday', 'banner', 'decorations', 'gold'],
  'active'
),
(
  'Birthday Cake Number Candles Set (0-9)',
  'birthday-cake-number-candles-set',
  'Cake Decorations',
  ARRAY['birthday'],
  299,
  NULL,
  0,
  'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&auto=format&fit=crop',
  'Complete set of number candles 0-9 with glitter finish. Perfect for milestone birthdays. Smokeless and long-lasting.',
  'Glitter number candles (0-9)',
  250,
  true,
  4.5,
  267,
  1024,
  false,
  true,
  ARRAY['birthday', 'cake', 'candles', 'numbers'],
  'active'
),
(
  'Birthday Party Hat Pack - 10 Pieces (Assorted Colors)',
  'birthday-party-hat-pack-10pcs',
  'Party Supplies',
  ARRAY['birthday'],
  349,
  NULL,
  0,
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop',
  'Fun party hats in assorted bright colors with elastic chin straps. Perfect for kids and adults. Pack of 10.',
  'Colorful party hat pack (10pcs)',
  320,
  true,
  4.4,
  156,
  678,
  false,
  false,
  ARRAY['birthday', 'party', 'hats', 'fun'],
  'active'
),
(
  'Birthday Party Tableware Set - Serves 20 People',
  'birthday-party-tableware-set-20',
  'Party Supplies',
  ARRAY['birthday'],
  899,
  NULL,
  0,
  'https://images.unsplash.com/photo-1567696153798-5ebeb43e67b0?w=800&auto=format&fit=crop',
  'Complete disposable tableware set including plates, cups, napkins, and cutlery for 20 people. Eco-friendly materials.',
  'Complete party tableware for 20',
  145,
  true,
  4.6,
  98,
  345,
  false,
  false,
  ARRAY['birthday', 'party', 'tableware', 'eco-friendly'],
  'active'
);

-- Insert Baby Shower Products
INSERT INTO products (
  name, slug, category, event_types, price, primary_image,
  description, short_description, stock_quantity, in_stock,
  rating_average, review_count, sales_count, is_featured, is_bestseller, tags, status
) VALUES
(
  'Baby Shower Decoration Kit - Pink (Girl)',
  'baby-shower-decoration-kit-pink',
  'Decorations',
  ARRAY['baby-shower'],
  1299,
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop',
  'Adorable pink-themed baby shower decoration kit including balloons, banners, pom-poms, and table centerpieces. Perfect for celebrating baby girls!',
  'Pink baby shower decoration kit',
  85,
  true,
  4.8,
  124,
  267,
  true,
  false,
  ARRAY['baby shower', 'decorations', 'pink', 'girl'],
  'active'
),
(
  'Baby Shower Decoration Kit - Blue (Boy)',
  'baby-shower-decoration-kit-blue',
  'Decorations',
  ARRAY['baby-shower'],
  1299,
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop',
  'Charming blue-themed baby shower decoration kit with balloons, "It''s a Boy" banner, and hanging decorations.',
  'Blue baby shower decoration kit',
  92,
  true,
  4.7,
  108,
  234,
  true,
  false,
  ARRAY['baby shower', 'decorations', 'blue', 'boy'],
  'active'
);

-- Insert Corporate Event Products
INSERT INTO products (
  name, slug, category, event_types, price, primary_image,
  description, short_description, stock_quantity, in_stock,
  rating_average, review_count, sales_count, is_featured, is_bestseller, tags, status
) VALUES
(
  'Corporate Event Banner - Custom Printing Available',
  'corporate-event-banner-custom',
  'Banners',
  ARRAY['corporate'],
  1999,
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
  'Professional quality banner for corporate events, conferences, and seminars. Custom printing available with your company logo and event details.',
  'Professional corporate event banner',
  50,
  true,
  4.9,
  67,
  189,
  true,
  false,
  ARRAY['corporate', 'banner', 'professional', 'custom'],
  'active'
),
(
  'Conference Name Badge Kit - 100 Pieces',
  'conference-name-badge-kit-100',
  'Accessories',
  ARRAY['corporate'],
  599,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
  'Professional name badge holders with lanyards. Perfect for conferences, seminars, and corporate events. Pack of 100.',
  'Name badge kit (100 pieces)',
  120,
  true,
  4.5,
  45,
  156,
  false,
  false,
  ARRAY['corporate', 'badges', 'conference'],
  'active'
);

-- Insert Engagement Products
INSERT INTO products (
  name, slug, category, event_types, price, primary_image,
  description, short_description, stock_quantity, in_stock,
  rating_average, review_count, sales_count, is_featured, is_bestseller, tags, status
) VALUES
(
  'Engagement Ring Box - Velvet Luxury',
  'engagement-ring-box-velvet',
  'Accessories',
  ARRAY['engagement'],
  499,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
  'Premium velvet ring box in burgundy or navy blue. Perfect for presenting the engagement ring. LED light option available.',
  'Luxury velvet engagement ring box',
  180,
  true,
  4.9,
  234,
  567,
  true,
  true,
  ARRAY['engagement', 'ring box', 'luxury'],
  'active'
),
(
  'Engagement Photo Frame - "She Said Yes!"',
  'engagement-photo-frame-she-said-yes',
  'Decorations',
  ARRAY['engagement'],
  799,
  'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800&auto=format&fit=crop',
  'Beautiful wooden photo frame with "She Said Yes!" engraving. Perfect gift and keepsake for engaged couples.',
  'Engraved engagement photo frame',
  95,
  true,
  4.7,
  78,
  234,
  false,
  false,
  ARRAY['engagement', 'photo frame', 'gift'],
  'active'
);

-- Insert Anniversary Products
INSERT INTO products (
  name, slug, category, event_types, price, primary_image,
  description, short_description, stock_quantity, in_stock,
  rating_average, review_count, sales_count, is_featured, is_bestseller, tags, status
) VALUES
(
  'Anniversary Decoration Kit - Red & Gold',
  'anniversary-decoration-kit-red-gold',
  'Decorations',
  ARRAY['anniversary'],
  1499,
  'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop',
  'Romantic anniversary decoration kit with red and gold balloons, heart-shaped decorations, and "Happy Anniversary" banner.',
  'Red & gold anniversary decoration',
  110,
  true,
  4.8,
  145,
  389,
  true,
  false,
  ARRAY['anniversary', 'decorations', 'romantic'],
  'active'
),
(
  'Anniversary Photo Collage Frame - 12 Photos',
  'anniversary-photo-collage-frame-12',
  'Decorations',
  ARRAY['anniversary'],
  1299,
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop',
  'Large wooden collage frame for 12 photos. Perfect for showcasing memories from your journey together.',
  '12-photo anniversary collage frame',
  75,
  true,
  4.6,
  89,
  178,
  false,
  false,
  ARRAY['anniversary', 'photo frame', 'memories'],
  'active'
);

-- Insert Universal Party Supplies
INSERT INTO products (
  name, slug, category, event_types, price, primary_image,
  description, short_description, stock_quantity, in_stock,
  rating_average, review_count, sales_count, is_featured, is_bestseller, tags, status
) VALUES
(
  'LED String Lights - Warm White (10 Meters)',
  'led-string-lights-warm-white-10m',
  'Lighting',
  ARRAY['wedding', 'birthday', 'anniversary', 'engagement'],
  799,
  'https://images.unsplash.com/photo-1515600051222-a3c338ff16f6?w=800&auto=format&fit=crop',
  'Beautiful warm white LED string lights perfect for any event. 10 meters long with 100 LED bulbs. Waterproof and energy efficient.',
  'Warm white LED lights (10m)',
  250,
  true,
  4.7,
  456,
  1234,
  true,
  true,
  ARRAY['lighting', 'LED', 'decorations', 'all events'],
  'active'
),
(
  'Confetti Cannon Set - Multicolor (6 Pieces)',
  'confetti-cannon-set-multicolor-6',
  'Party Supplies',
  ARRAY['wedding', 'birthday', 'anniversary'],
  699,
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
  'Fun confetti cannons for celebrations! Pack of 6 with multicolor biodegradable confetti. Easy to use and creates magical moments.',
  'Confetti cannon party pack (6pcs)',
  180,
  true,
  4.8,
  234,
  678,
  true,
  true,
  ARRAY['party', 'confetti', 'celebration', 'fun'],
  'active'
);

-- Verify inserted products
SELECT 
  name,
  category,
  price,
  rating_average,
  sales_count,
  is_featured,
  is_bestseller,
  '✅ Product inserted!' as status
FROM products
ORDER BY created_at DESC
LIMIT 20;

SELECT COUNT(*) as total_products, '✅ Total products in database' as info FROM products;
