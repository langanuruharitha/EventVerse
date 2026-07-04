-- Simple test to insert categories and a few products
-- Run this in Supabase SQL Editor to test

-- Step 1: Insert categories (with UPSERT)
INSERT INTO product_categories (name, slug, description, event_types, display_order, is_active)
VALUES 
    ('Balloons', 'balloons', 'Party balloons', ARRAY['birthday', 'wedding'], 1, true),
    ('Decorations', 'decorations', 'Party decorations', ARRAY['birthday', 'wedding'], 2, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    event_types = EXCLUDED.event_types;

-- Step 2: Insert test products
INSERT INTO products (sku, name, slug, short_description, category_id, event_types, price, status) VALUES
('TEST001', 'Rainbow Balloons', 'rainbow-balloons-test', 'Colorful rainbow balloons', (SELECT id FROM product_categories WHERE slug = 'balloons'), ARRAY['birthday'], 199, 'active'),
('TEST002', 'Birthday Banner', 'birthday-banner-test', 'Happy Birthday banner', (SELECT id FROM product_categories WHERE slug = 'decorations'), ARRAY['birthday'], 149, 'active'),
('TEST003', 'Party Confetti', 'party-confetti-test', 'Colorful party confetti', (SELECT id FROM product_categories WHERE slug = 'decorations'), ARRAY['birthday'], 99, 'active');

-- Verify insertion
SELECT COUNT(*) as category_count FROM product_categories;
SELECT COUNT(*) as product_count FROM products;
SELECT * FROM products;
