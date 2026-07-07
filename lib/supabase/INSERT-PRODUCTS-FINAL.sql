-- =====================================================
-- INSERT REAL SHOP PRODUCTS - FINAL CORRECT VERSION
-- =====================================================
-- Matches your ACTUAL products table schema exactly

-- First, ensure categories exist
INSERT INTO product_categories (name, slug, description, icon_name, is_active, display_order, parent_id)
VALUES
  ('Decorations', 'decorations', 'Event decorations and decor items', '🎨', true, 1, NULL),
  ('Cake Decorations', 'cake-decorations', 'Cake toppers, candles, and accessories', '🎂', true, 2, NULL),
  ('Photo Booth', 'photo-booth', 'Photo booth props and accessories', '📸', true, 3, NULL),
  ('Flowers', 'flowers', 'Fresh and artificial flowers', '💐', true, 4, NULL),
  ('Accessories', 'accessories', 'Event accessories and supplies', '✨', true, 5, NULL),
  ('Party Supplies', 'party-supplies', 'Party essentials and supplies', '🎉', true, 6, NULL),
  ('Lighting', 'lighting', 'Event lighting and decorative lights', '💡', true, 7, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Insert Wedding Products
INSERT INTO products (
  sku, name, slug, category_id, event_types, price, original_price, discount_percentage,
  primary_image_url, images, long_description, short_description,
  stock_quantity, rating_average, review_count, sales_count,
  is_featured, is_bestseller, tags, status
) VALUES
(
  'SKU-WED-001',
  'Premium Wedding Decoration Package - Flowers & Drapes',
  'premium-wedding-decoration-flowers-drapes',
  (SELECT id FROM product_categories WHERE slug = 'decorations' LIMIT 1),
  ARRAY['wedding', 'engagement'],
  15999.00,
  22999.00,
  30.00,
  'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY[
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=800',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=800',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=800'
  ],
  'Transform your wedding venue with our premium decoration package featuring elegant floral arrangements, flowing drapes, and ambient lighting. Includes fresh flower bouquets, table centerpieces, backdrop setup, and professional installation.',
  'Complete wedding decoration with flowers, drapes & lighting',
  25,
  4.8,
  156,
  342,
  true,
  true,
  ARRAY['wedding', 'flowers', 'decorations', 'premium', 'bestseller'],
  'active'
),
(
  'SKU-WED-002',
  'Elegant Bride & Groom Cake Topper Set',
  'elegant-bride-groom-cake-topper',
  (SELECT id FROM product_categories WHERE slug = 'cake-decorations' LIMIT 1),
  ARRAY['wedding'],
  899.00,
  1299.00,
  31.00,
  'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=800',
  NULL,
  'Beautiful handcrafted cake topper featuring bride and groom figurines. Made from premium materials with intricate detailing. Perfect keepsake for your special day.',
  'Handcrafted wedding cake topper',
  150,
  4.9,
  89,
  567,
  true,
  true,
  ARRAY['wedding', 'cake', 'topper', 'decoration'],
  'active'
),
(
  'SKU-WED-003',
  'Wedding Photo Booth Props Kit (25 Pieces)',
  'wedding-photo-booth-props-kit',
  (SELECT id FROM product_categories WHERE slug = 'photo-booth' LIMIT 1),
  ARRAY['wedding', 'engagement'],
  1499.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
  NULL,
  'Make your wedding photos memorable with our 25-piece photo booth props kit. Includes funny glasses, mustaches, speech bubbles, and themed signs.',
  '25 fun photo booth props for wedding',
  80,
  4.7,
  124,
  289,
  true,
  false,
  ARRAY['wedding', 'photo booth', 'props', 'entertainment'],
  'active'
),
(
  'SKU-WED-004',
  'Luxury Wedding Flower Bouquet - Mixed Roses',
  'luxury-wedding-flower-bouquet-roses',
  (SELECT id FROM product_categories WHERE slug = 'flowers' LIMIT 1),
  ARRAY['wedding'],
  2499.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/1416536/pexels-photo-1416536.jpeg?auto=compress&cs=tinysrgb&w=800',
  NULL,
  'Stunning bridal bouquet featuring premium mixed roses in white, pink, and cream. Hand-tied with satin ribbon. Fresh flowers delivered on your wedding day.',
  'Premium rose bridal bouquet',
  40,
  5.0,
  78,
  234,
  true,
  true,
  ARRAY['wedding', 'flowers', 'bouquet', 'roses'],
  'active'
),
(
  'SKU-WED-005',
  'Wedding Ring Bearer Pillow - Ivory Lace',
  'wedding-ring-bearer-pillow-ivory',
  (SELECT id FROM product_categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['wedding'],
  699.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/11639074/pexels-photo-11639074.jpeg?auto=compress&cs=tinysrgb&w=800',
  NULL,
  'Beautiful ivory lace ring bearer pillow with pearl embellishments. Elegant design perfect for traditional or modern weddings.',
  'Ivory lace ring bearer pillow',
  95,
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
  sku, name, slug, category_id, event_types, price, original_price, discount_percentage,
  primary_image_url, long_description, short_description,
  stock_quantity, rating_average, review_count, sales_count,
  is_featured, is_bestseller, tags, status
) VALUES
(
  'SKU-BIR-001',
  'Birthday Balloon Decoration Set - 50 Pieces (Multi-Color)',
  'birthday-balloon-decoration-set-50pcs',
  (SELECT id FROM product_categories WHERE slug = 'decorations' LIMIT 1),
  ARRAY['birthday'],
  799.00,
  1199.00,
  33.00,
  'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Complete birthday balloon decoration set with 50 colorful balloons including latex balloons, foil number balloons, and confetti balloons. Perfect for all ages!',
  '50-piece colorful balloon decoration set',
  200,
  4.6,
  312,
  892,
  true,
  true,
  ARRAY['birthday', 'balloons', 'decorations', 'colorful', 'bestseller'],
  'active'
),
(
  'SKU-BIR-002',
  'Happy Birthday Banner & Bunting Set - Gold Rose',
  'happy-birthday-banner-bunting-gold-rose',
  (SELECT id FROM product_categories WHERE slug = 'decorations' LIMIT 1),
  ARRAY['birthday'],
  449.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/6224/hands-woman-laptop-notebook.jpg?auto=compress&cs=tinysrgb&w=800',
  'Elegant gold and rose gold happy birthday banner with matching bunting flags. Reusable and perfect for Instagram-worthy celebrations.',
  'Gold rose birthday banner set',
  175,
  4.7,
  189,
  456,
  true,
  false,
  ARRAY['birthday', 'banner', 'decorations', 'gold'],
  'active'
),
(
  'SKU-BIR-003',
  'Birthday Cake Number Candles Set (0-9)',
  'birthday-cake-number-candles-set',
  (SELECT id FROM product_categories WHERE slug = 'cake-decorations' LIMIT 1),
  ARRAY['birthday'],
  299.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Complete set of number candles 0-9 with glitter finish. Perfect for milestone birthdays. Smokeless and long-lasting.',
  'Glitter number candles (0-9)',
  250,
  4.5,
  267,
  1024,
  false,
  true,
  ARRAY['birthday', 'cake', 'candles', 'numbers'],
  'active'
),
(
  'SKU-BIR-004',
  'Birthday Party Hat Pack - 10 Pieces (Assorted Colors)',
  'birthday-party-hat-pack-10pcs',
  (SELECT id FROM product_categories WHERE slug = 'party-supplies' LIMIT 1),
  ARRAY['birthday'],
  349.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/1002272/pexels-photo-1002272.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Fun party hats in assorted bright colors with elastic chin straps. Perfect for kids and adults. Pack of 10.',
  'Colorful party hat pack (10pcs)',
  320,
  4.4,
  156,
  678,
  false,
  false,
  ARRAY['birthday', 'party', 'hats', 'fun'],
  'active'
),
(
  'SKU-BIR-005',
  'Birthday Party Tableware Set - Serves 20 People',
  'birthday-party-tableware-set-20',
  (SELECT id FROM product_categories WHERE slug = 'party-supplies' LIMIT 1),
  ARRAY['birthday'],
  899.00,
  NULL,
  0.00,
  'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Complete disposable tableware set including plates, cups, napkins, and cutlery for 20 people. Eco-friendly materials.',
  'Complete party tableware for 20',
  145,
  4.6,
  98,
  345,
  false,
  false,
  ARRAY['birthday', 'party', 'tableware', 'eco-friendly'],
  'active'
);

-- Insert Universal Party Supplies
INSERT INTO products (
  sku, name, slug, category_id, event_types, price,
  primary_image_url, long_description, short_description,
  stock_quantity, rating_average, review_count, sales_count,
  is_featured, is_bestseller, tags, status
) VALUES
(
  'SKU-UNI-001',
  'LED String Lights - Warm White (10 Meters)',
  'led-string-lights-warm-white-10m',
  (SELECT id FROM product_categories WHERE slug = 'lighting' LIMIT 1),
  ARRAY['wedding', 'birthday', 'anniversary', 'engagement'],
  799.00,
  'https://images.pexels.com/photos/1210276/pexels-photo-1210276.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Beautiful warm white LED string lights perfect for any event. 10 meters long with 100 LED bulbs. Waterproof and energy efficient.',
  'Warm white LED lights (10m)',
  250,
  4.7,
  456,
  1234,
  true,
  true,
  ARRAY['lighting', 'LED', 'decorations', 'all events'],
  'active'
),
(
  'SKU-UNI-002',
  'Confetti Cannon Set - Multicolor (6 Pieces)',
  'confetti-cannon-set-multicolor-6',
  (SELECT id FROM product_categories WHERE slug = 'party-supplies' LIMIT 1),
  ARRAY['wedding', 'birthday', 'anniversary'],
  699.00,
  'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Fun confetti cannons for celebrations! Pack of 6 with multicolor biodegradable confetti. Easy to use and creates magical moments.',
  'Confetti cannon party pack (6pcs)',
  180,
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
  sku,
  name,
  price,
  rating_average,
  sales_count,
  is_featured,
  is_bestseller,
  '✅ Product inserted!' as status
FROM products
WHERE sku LIKE 'SKU-%'
ORDER BY created_at DESC
LIMIT 12;

SELECT COUNT(*) as total_products, '✅ Total products in database' as info FROM products WHERE sku LIKE 'SKU-%';
