-- ================================================================
-- 120+ INVITATION TEMPLATES (30+ per event type)
-- Event Types: Birthday, Wedding, Anniversary, Corporate
-- ================================================================

-- Delete existing templates to avoid duplicates
DELETE FROM invitation_templates;

-- ================================================================
-- 1. BIRTHDAY TEMPLATES (30 templates)
-- ================================================================

-- Modern Birthday Templates
INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium, rating_average) VALUES
('Modern Birthday Celebration', 'birthday', 'modern', 'portrait', 'rainbow', 'https://placehold.co/600x800/FF69B4/white?text=Modern+Birthday', '{"layout":"centered","fonts":["Montserrat","Open Sans"],"elements":[]}', FALSE, 4.5),
('Minimalist Birthday', 'birthday', 'minimalist', 'landscape', 'pastel', 'https://placehold.co/800x600/FFB6C1/white?text=Minimalist+Birthday', '{"layout":"minimal","fonts":["Lato","Roboto"],"elements":[]}', FALSE, 4.7),
('Fun Birthday Party', 'birthday', 'fun', 'square', 'bright-colors', 'https://placehold.co/600x600/FFA500/white?text=Fun+Party', '{"layout":"playful","fonts":["Comic Sans MS","Arial"],"elements":[]}', FALSE, 4.3),
('Elegant Birthday', 'birthday', 'elegant', 'portrait', 'gold-white', 'https://placehold.co/600x800/FFD700/white?text=Elegant+Birthday', '{"layout":"formal","fonts":["Playfair Display","Lato"],"elements":[]}', TRUE, 4.8),
('Kids Birthday Bash', 'birthday', 'fun', 'landscape', 'cartoon', 'https://placehold.co/800x600/87CEEB/white?text=Kids+Bash', '{"layout":"playful","fonts":["Comic Sans","Arial Rounded"],"elements":[]}', FALSE, 4.6);

-- More Birthday Templates
INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium, rating_average) VALUES
('Vintage Birthday', 'birthday', 'vintage', 'portrait', 'sepia', 'https://placehold.co/600x800/DEB887/white?text=Vintage+Birthday', '{"layout":"classic","fonts":["Georgia","Times"],"elements":[]}', TRUE, 4.9),
('Neon Birthday', 'birthday', 'modern', 'square', 'neon', 'https://placehold.co/600x600/FF00FF/white?text=Neon+Birthday', '{"layout":"bold","fonts":["Impact","Helvetica"],"elements":[]}', FALSE, 4.4),
('Floral Birthday', 'birthday', 'elegant', 'portrait', 'pink-floral', 'https://placehold.co/600x800/FF1493/white?text=Floral+Birthday', '{"layout":"decorative","fonts":["Dancing Script","Lato"],"elements":[]}', FALSE, 4.7),
('Sports Theme Birthday', 'birthday', 'fun', 'landscape', 'sports', 'https://placehold.co/800x600/228B22/white?text=Sports+Birthday', '{"layout":"athletic","fonts":["Arial Black","Arial"],"elements":[]}', FALSE, 4.5),
('Princess Birthday', 'birthday', 'elegant', 'portrait', 'pink-purple', 'https://placehold.co/600x800/DDA0DD/white?text=Princess+Birthday', '{"layout":"royal","fonts":["Cinzel","Lato"],"elements":[]}', TRUE, 4.8),
('Superhero Birthday', 'birthday', 'fun', 'landscape', 'comic', 'https://placehold.co/800x600/DC143C/white?text=Superhero+Birthday', '{"layout":"comic","fonts":["Comic Sans","Impact"],"elements":[]}', FALSE, 4.6),
('Garden Party Birthday', 'birthday', 'elegant', 'square', 'green-floral', 'https://placehold.co/600x600/90EE90/white?text=Garden+Party', '{"layout":"natural","fonts":["Pacifico","Lato"],"elements":[]}', FALSE, 4.7),
('Glitter Birthday', 'birthday', 'fun', 'portrait', 'glitter-gold', 'https://placehold.co/600x800/FFD700/white?text=Glitter+Birthday', '{"layout":"sparkly","fonts":["Great Vibes","Lato"],"elements":[]}', TRUE, 4.9),
('Beach Birthday', 'birthday', 'fun', 'landscape', 'beach-blue', 'https://placehold.co/800x600/1E90FF/white?text=Beach+Birthday', '{"layout":"tropical","fonts":["Lobster","Open Sans"],"elements":[]}', FALSE, 4.5),
('Space Theme Birthday', 'birthday', 'fun', 'square', 'space-dark', 'https://placehold.co/600x600/000080/white?text=Space+Birthday', '{"layout":"cosmic","fonts":["Orbitron","Roboto"],"elements":[]}', FALSE, 4.6);

-- Additional Birthday Templates (15 more to complete 30)
INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium, rating_average) VALUES
('Unicorn Birthday', 'birthday', 'fun', 'portrait', 'rainbow-pastel', 'https://placehold.co/600x800/FFB6C1/white?text=Unicorn+Birthday', '{"layout":"magical","fonts":["Pacifico","Arial"],"elements":[]}', FALSE, 4.8),
('Dinosaur Birthday', 'birthday', 'fun', 'landscape', 'green-brown', 'https://placehold.co/800x600/8B4513/white?text=Dinosaur+Birthday', '{"layout":"prehistoric","fonts":["Impact","Arial"],"elements":[]}', FALSE, 4.5),
('Mermaid Birthday', 'birthday', 'elegant', 'portrait', 'ocean-teal', 'https://placehold.co/600x800/20B2AA/white?text=Mermaid+Birthday', '{"layout":"underwater","fonts":["Pacifico","Lato"],"elements":[]}', TRUE, 4.9),
('Balloon Fiesta', 'birthday', 'fun', 'square', 'multi-color', 'https://placehold.co/600x600/FFA500/white?text=Balloon+Fiesta', '{"layout":"festive","fonts":["Fredoka One","Arial"],"elements":[]}', FALSE, 4.6),
('Candyland Birthday', 'birthday', 'fun', 'landscape', 'candy-colors', 'https://placehold.co/800x600/FF69B4/white?text=Candyland', '{"layout":"sweet","fonts":["Comic Sans","Arial"],"elements":[]}', FALSE, 4.7),
('Rock Star Birthday', 'birthday', 'modern', 'portrait', 'rock-black', 'https://placehold.co/600x800/000000/white?text=Rock+Star', '{"layout":"edgy","fonts":["Rock Salt","Arial"],"elements":[]}', FALSE, 4.5),
('Boho Birthday', 'birthday', 'elegant', 'square', 'earth-tones', 'https://placehold.co/600x600/D2691E/white?text=Boho+Birthday', '{"layout":"bohemian","fonts":["Satisfy","Lato"],"elements":[]}', TRUE, 4.8),
('Circus Birthday', 'birthday', 'fun', 'landscape', 'circus-red', 'https://placehold.co/800x600/DC143C/white?text=Circus+Birthday', '{"layout":"carnival","fonts":["Luckiest Guy","Arial"],"elements":[]}', FALSE, 4.6),
('Movie Night Birthday', 'birthday', 'modern', 'portrait', 'cinema-dark', 'https://placehold.co/600x800/2F4F4F/white?text=Movie+Night', '{"layout":"theatrical","fonts":["Oswald","Roboto"],"elements":[]}', FALSE, 4.5),
('Jungle Safari Birthday', 'birthday', 'fun', 'landscape', 'jungle-green', 'https://placehold.co/800x600/228B22/white?text=Jungle+Safari', '{"layout":"wild","fonts":["Fredoka One","Arial"],"elements":[]}', FALSE, 4.7),
('Tea Party Birthday', 'birthday', 'elegant', 'square', 'tea-pastels', 'https://placehold.co/600x600/FFB6C1/white?text=Tea+Party', '{"layout":"refined","fonts":["Dancing Script","Lato"],"elements":[]}', TRUE, 4.9),
('Gaming Birthday', 'birthday', 'modern', 'landscape', 'gaming-neon', 'https://placehold.co/800x600/00FF00/white?text=Gaming+Birthday', '{"layout":"digital","fonts":["Press Start 2P","Arial"],"elements":[]}', FALSE, 4.6),
('Art Party Birthday', 'birthday', 'fun', 'portrait', 'artist-colors', 'https://placehold.co/600x800/FF6347/white?text=Art+Party', '{"layout":"creative","fonts":["Fredericka the Great","Arial"],"elements":[]}', FALSE, 4.7),
('Picnic Birthday', 'birthday', 'elegant', 'landscape', 'picnic-gingham', 'https://placehold.co/800x600/90EE90/white?text=Picnic+Birthday', '{"layout":"outdoor","fonts":["Pacifico","Lato"],"elements":[]}', FALSE, 4.5),
('Starry Night Birthday', 'birthday', 'elegant', 'square', 'night-stars', 'https://placehold.co/600x600/191970/white?text=Starry+Night', '{"layout":"celestial","fonts":["Great Vibes","Lato"],"elements":[]}', TRUE, 4.8);

-- ================================================================
-- 2. WEDDING TEMPLATES (30 templates)
-- ================================================================

-- Wedding Templates (30 templates)
DO $$
DECLARE
  wedding_names TEXT[] := ARRAY[
    'Classic Wedding', 'Modern Wedding', 'Royal Wedding', 'Garden Wedding', 'Beach Wedding',
    'Vintage Wedding', 'Rustic Wedding', 'Elegant Wedding', 'Destination Wedding', 'Traditional Indian Wedding',
    'Floral Wedding', 'Minimalist Wedding', 'Luxury Wedding', 'Boho Wedding', 'Fairytale Wedding',
    'Spring Wedding', 'Winter Wedding', 'Autumn Wedding', 'Summer Wedding', 'Rose Gold Wedding',
    'Pastel Wedding', 'Navy & Gold Wedding', 'Burgundy Wedding', 'Blush Pink Wedding', 'Greenery Wedding',
    'Art Deco Wedding', 'Tropical Wedding', 'Mountain Wedding', 'Vineyard Wedding', 'Palace Wedding'
  ];
  i INT;
BEGIN
  FOR i IN 1..array_length(wedding_names, 1) LOOP
    INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium, rating_average)
    VALUES (
      wedding_names[i],
      'wedding',
      CASE WHEN i <= 10 THEN 'elegant' WHEN i <= 20 THEN 'traditional' ELSE 'modern' END,
      CASE WHEN i % 3 = 0 THEN 'landscape' WHEN i % 3 = 1 THEN 'portrait' ELSE 'square' END,
      'gold-white',
      'https://placehold.co/600x800/FFD700/white?text=' || REPLACE(wedding_names[i], ' ', '+'),
      '{"layout":"elegant","fonts":["Playfair Display","Lato"],"elements":[]}',
      (i % 3 = 0),
      4.5 + (RANDOM() * 0.5)
    );
  END LOOP;
END $$;

-- ================================================================
-- 3. ANNIVERSARY TEMPLATES (30 templates)
-- ================================================================
DO $$
DECLARE
  anniversary_names TEXT[] := ARRAY[
    'Golden Anniversary', 'Silver Anniversary', 'Diamond Anniversary', 'Ruby Anniversary', 'Pearl Anniversary',
    'Sapphire Anniversary', 'Emerald Anniversary', 'Coral Anniversary', 'Crystal Anniversary', 'Bronze Anniversary',
    'Modern Anniversary', 'Elegant Anniversary', 'Romantic Anniversary', 'Vintage Anniversary', 'Classic Anniversary',
    '25th Anniversary', '50th Anniversary', '1st Anniversary', '10th Anniversary', '20th Anniversary',
    'Love Story Anniversary', 'Timeline Anniversary', 'Photo Collage Anniversary', 'Minimalist Anniversary', 'Luxury Anniversary',
    'Floral Anniversary', 'Heart Theme Anniversary', 'Celebration Anniversary', 'Milestone Anniversary', 'Forever Love Anniversary'
  ];
  i INT;
BEGIN
  FOR i IN 1..array_length(anniversary_names, 1) LOOP
    INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium, rating_average)
    VALUES (
      anniversary_names[i],
      'anniversary',
      CASE WHEN i <= 15 THEN 'elegant' ELSE 'modern' END,
      CASE WHEN i % 3 = 0 THEN 'landscape' WHEN i % 3 = 1 THEN 'portrait' ELSE 'square' END,
      CASE WHEN i <= 5 THEN 'gold-white' WHEN i <= 10 THEN 'silver-white' ELSE 'romantic-pink' END,
      'https://placehold.co/600x800/DC143C/white?text=' || REPLACE(anniversary_names[i], ' ', '+'),
      '{"layout":"romantic","fonts":["Dancing Script","Lato"],"elements":[]}',
      (i % 4 = 0),
      4.4 + (RANDOM() * 0.6)
    );
  END LOOP;
END $$;

-- ================================================================
-- 4. CORPORATE TEMPLATES (30 templates)
-- ================================================================
DO $$
DECLARE
  corporate_names TEXT[] := ARRAY[
    'Professional Conference', 'Business Summit', 'Corporate Annual Meet', 'Team Building Event', 'Product Launch',
    'Company Celebration', 'Awards Ceremony', 'Executive Retreat', 'Networking Event', 'Industry Conference',
    'Board Meeting Invite', 'Stakeholder Meeting', 'Training Workshop', 'Seminar Invitation', 'Corporate Gala',
    'Business Dinner', 'Company Milestone', 'Office Party', 'Leadership Summit', 'Innovation Forum',
    'Tech Conference', 'Sales Kickoff', 'Customer Appreciation', 'Partner Event', 'Corporate Social',
    'Town Hall Meeting', 'Quarterly Review', 'Strategy Session', 'Employee Recognition', 'Corporate Retreat'
  ];
  i INT;
BEGIN
  FOR i IN 1..array_length(corporate_names, 1) LOOP
    INSERT INTO invitation_templates (name, category, style, orientation, color_scheme, thumbnail_url, template_data, is_premium, rating_average)
    VALUES (
      corporate_names[i],
      'corporate',
      'professional',
      CASE WHEN i % 2 = 0 THEN 'landscape' ELSE 'portrait' END,
      CASE WHEN i <= 10 THEN 'corporate-blue' WHEN i <= 20 THEN 'professional-gray' ELSE 'modern-black' END,
      'https://placehold.co/800x600/4169E1/white?text=' || REPLACE(corporate_names[i], ' ', '+'),
      '{"layout":"professional","fonts":["Arial","Helvetica"],"elements":[]}',
      (i % 5 = 0),
      4.3 + (RANDOM() * 0.7)
    );
  END LOOP;
END $$;

-- ================================================================
-- Summary Report
-- ================================================================
DO $$
BEGIN
  RAISE NOTICE '=== INVITATION TEMPLATES SUMMARY ===';
  RAISE NOTICE 'Total templates: %', (SELECT COUNT(*) FROM invitation_templates);
  RAISE NOTICE 'Birthday templates: %', (SELECT COUNT(*) FROM invitation_templates WHERE category = 'birthday');
  RAISE NOTICE 'Wedding templates: %', (SELECT COUNT(*) FROM invitation_templates WHERE category = 'wedding');
  RAISE NOTICE 'Anniversary templates: %', (SELECT COUNT(*) FROM invitation_templates WHERE category = 'anniversary');
  RAISE NOTICE 'Corporate templates: %', (SELECT COUNT(*) FROM invitation_templates WHERE category = 'corporate');
  RAISE NOTICE 'Premium templates: %', (SELECT COUNT(*) FROM invitation_templates WHERE is_premium = TRUE);
END $$;

-- ================================================================
-- DONE! 120 invitation templates created (30 per category)!
-- ================================================================
