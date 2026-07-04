-- ================================================================
-- 500+ VENUES DATA - Diverse Locations & Budget Ranges
-- ================================================================

-- This generates 500+ venues across multiple cities with various budget ranges
-- Budget categories: Budget (₹20k-50k), Mid-Range (₹50k-1L), Premium (₹1L-3L), Luxury (₹3L+)

-- Function to generate random venues with REAL images
DO $$
DECLARE
  cities TEXT[] := ARRAY['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Bhopal', 'Chandigarh', 'Kochi', 'Visakhapatnam'];
  states TEXT[] := ARRAY['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Madhya Pradesh', 'Punjab', 'Kerala', 'Andhra Pradesh'];
  venue_types TEXT[] := ARRAY['banquet_hall', 'garden', 'resort', 'hotel', 'farmhouse', 'rooftop'];
  venue_names_prefix TEXT[] := ARRAY['Royal', 'Grand', 'Elite', 'Paradise', 'Heritage', 'Crown', 'Imperial', 'Majestic', 'Golden', 'Silver', 'Diamond', 'Pearl', 'Emerald', 'Sapphire', 'Crystal'];
  venue_names_suffix TEXT[] := ARRAY['Palace', 'Gardens', 'Banquets', 'Resort', 'Farmhouse', 'Convention', 'Hall', 'Manor', 'Estate', 'Villa'];
  
  -- Real function hall images from Unsplash - Banquet Halls, Wedding Venues
  real_images TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1519167758481-83f29da8303a?w=800',  -- Elegant banquet hall with chandeliers
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',  -- Wedding reception setup
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',  -- Modern event space
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',  -- Luxury ballroom
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',  -- Garden venue
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',  -- Outdoor wedding venue
    'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800',  -- Restaurant banquet area
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',  -- Conference hall
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',  -- Party venue
    'https://images.unsplash.com/photo-1515169273894-7e876dcf13da?w=800',  -- Rooftop venue
    'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800',  -- Resort function hall
    'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800',  -- Hotel banquet
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',  -- Wedding hall
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',  -- Outdoor event space
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',  -- Farmhouse venue
    'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800',  -- Dining hall
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',  -- Indoor venue
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',  -- Grand ballroom
    'https://images.unsplash.com/photo-1540224811837-f879c90d0a2b?w=800',  -- Convention center
    'https://images.unsplash.com/photo-1551650992-c012f0b9b3e1?w=800',  -- Modern hall
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',  -- Garden party venue
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',  -- Fine dining venue
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',  -- Meeting hall
    'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800',  -- Resort venue
    'https://images.unsplash.com/photo-1519167758481-83f29da8303a?w=800',  -- Elegant hall
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',  -- Contemporary space
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800',  -- Event venue
    'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800',  -- Outdoor venue
    'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=800',  -- Function hall
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',  -- Wedding venue
    'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800',  -- Resort hall
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',  -- Reception hall
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',  -- Outdoor space
    'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800',  -- Hotel venue
    'https://images.unsplash.com/photo-1515169273894-7e876dcf13da?w=800'   -- Rooftop space
  ];
  
  feature_sets TEXT[][] := ARRAY[
    ARRAY['Elegant Crystal Chandeliers', 'Premium Air Conditioning', 'Professional Sound System', 'Spacious Dance Floor', 'Dedicated Parking Space'],
    ARRAY['Beautiful Garden Setting', 'Outdoor Catering Area', 'Natural Lighting', 'Lush Green Lawns', 'Photo Points'],
    ARRAY['Luxury Accommodation', 'Swimming Pool', 'Spa Services', 'Multi-Cuisine Restaurant', 'Banquet Halls'],
    ARRAY['City View Rooftop', 'Modern Interiors', 'LED Screen Display', 'Premium Bar Service', 'Valet Parking'],
    ARRAY['Traditional Architecture', 'Open Air Spaces', 'Bonfire Area', 'Farm Fresh Catering', 'Kids Play Area']
  ];
  
  city_idx INT;
  venue_type TEXT;
  venue_name TEXT;
  slug_val TEXT;
  weekday_price DECIMAL;
  weekend_price DECIMAL;
  capacity_min INT;
  capacity_max INT;
  base_price INT;
  budget_category TEXT;
  selected_image TEXT;
  selected_features TEXT[];
  
  i INT;
BEGIN
  -- Generate 35 venues per city (15 cities × 35 = 525 venues)
  FOR city_idx IN 1..15 LOOP
    FOR i IN 1..35 LOOP
      -- Determine budget category (varied distribution)
      IF i <= 10 THEN
        budget_category := 'budget';
        base_price := 25000 + (RANDOM() * 25000)::INT; -- ₹25k-50k
        capacity_min := 50;
        capacity_max := 150;
      ELSIF i <= 20 THEN
        budget_category := 'mid_range';
        base_price := 50000 + (RANDOM() * 50000)::INT; -- ₹50k-1L
        capacity_min := 100;
        capacity_max := 300;
      ELSIF i <= 30 THEN
        budget_category := 'premium';
        base_price := 100000 + (RANDOM() * 200000)::INT; -- ₹1L-3L
        capacity_min := 200;
        capacity_max := 500;
      ELSE
        budget_category := 'luxury';
        base_price := 300000 + (RANDOM() * 500000)::INT; -- ₹3L-8L
        capacity_min := 300;
        capacity_max := 1000;
      END IF;
      
      -- Generate venue details
      venue_type := venue_types[1 + (RANDOM() * (array_length(venue_types, 1) - 1))::INT];
      venue_name := venue_names_prefix[1 + (RANDOM() * (array_length(venue_names_prefix, 1) - 1))::INT] || ' ' || 
                    venue_names_suffix[1 + (RANDOM() * (array_length(venue_names_suffix, 1) - 1))::INT];
      slug_val := LOWER(REGEXP_REPLACE(venue_name || '-' || cities[city_idx] || '-' || i::TEXT, '[^a-z0-9]+', '-', 'g'));
      
      weekday_price := base_price;
      weekend_price := base_price * 1.3; -- 30% more on weekends
      
      -- Select random image and features
      selected_image := real_images[1 + (RANDOM() * (array_length(real_images, 1) - 1))::INT];
      selected_features := feature_sets[1 + (RANDOM() * (array_length(feature_sets, 1) - 1))::INT];
      
      -- Insert venue
      INSERT INTO venues (
        venue_name,
        slug,
        category_id,
        venue_type,
        description,
        highlights,
        city,
        state,
        country,
        address_line1,
        pincode,
        latitude,
        longitude,
        seated_capacity_min,
        seated_capacity_max,
        standing_capacity,
        weekday_price,
        weekend_price,
        peak_season_price,
        per_plate_veg_min,
        per_plate_veg_max,
        per_plate_nonveg_min,
        per_plate_nonveg_max,
        security_deposit,
        is_ac,
        is_outdoor,
        parking_cars,
        parking_bikes,
        has_wifi,
        has_power_backup,
        allows_outside_catering,
        allows_alcohol,
        is_wheelchair_accessible,
        has_accommodation,
        accommodation_rooms,
        primary_image_url,
        images,
        listing_status,
        verification_status,
        is_featured,
        average_rating,
        total_reviews
      ) VALUES (
        venue_name || ' - ' || cities[city_idx],
        slug_val,
        (SELECT id FROM venue_categories WHERE category_name = CASE 
          WHEN venue_type = 'banquet_hall' THEN 'Banquet Halls'
          WHEN venue_type = 'garden' THEN 'Garden Venues'
          WHEN venue_type = 'resort' THEN 'Resorts'
          WHEN venue_type = 'hotel' THEN 'Hotels'
          WHEN venue_type = 'farmhouse' THEN 'Farmhouses'
          ELSE 'Rooftop Venues'
        END LIMIT 1),
        venue_type,
        'A beautiful ' || venue_type || ' venue perfect for ' || budget_category || ' events. Featuring modern amenities and elegant décor. Perfect for weddings, parties, and corporate events.',
        selected_features,
        cities[city_idx],
        states[city_idx],
        'India',
        (RANDOM() * 100)::INT || ' Main Road, ' || cities[city_idx],
        (400000 + (RANDOM() * 100000))::INT::TEXT,
        18.0 + (RANDOM() * 15), -- Latitude range for India
        72.0 + (RANDOM() * 16), -- Longitude range for India
        capacity_min,
        capacity_max,
        (capacity_max * 1.5)::INT,
        weekday_price,
        weekend_price,
        weekend_price * 1.2,
        350 + (RANDOM() * 200)::INT,
        550 + (RANDOM() * 300)::INT,
        450 + (RANDOM() * 250)::INT,
        750 + (RANDOM() * 400)::INT,
        weekday_price * 0.2, -- 20% security deposit
        TRUE, -- AC
        venue_type IN ('garden', 'rooftop'), -- Outdoor
        50 + (RANDOM() * 150)::INT,
        100 + (RANDOM() * 300)::INT,
        TRUE, -- WiFi
        TRUE, -- Power backup
        budget_category IN ('budget', 'mid_range'), -- Outside catering
        budget_category NOT IN ('budget'), -- Alcohol
        TRUE, -- Wheelchair accessible
        venue_type IN ('resort', 'hotel'), -- Accommodation
        CASE WHEN venue_type IN ('resort', 'hotel') THEN 10 + (RANDOM() * 40)::INT ELSE 0 END,
        selected_image, -- Use real Unsplash image
        ARRAY[
          selected_image,
          real_images[1 + (RANDOM() * (array_length(real_images, 1) - 1))::INT],
          real_images[1 + (RANDOM() * (array_length(real_images, 1) - 1))::INT]
        ],
        'active',
        'verified',
        (RANDOM() > 0.85), -- 15% featured
        3.5 + (RANDOM() * 1.5), -- Rating 3.5-5.0
        5 + (RANDOM() * 50)::INT -- 5-55 reviews
      );
    END LOOP;
  END LOOP;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_budget_range ON venues(weekday_price);
CREATE INDEX IF NOT EXISTS idx_venues_capacity_range ON venues(seated_capacity_min, seated_capacity_max);
CREATE INDEX IF NOT EXISTS idx_venues_city_budget ON venues(city, weekday_price);

-- Update venue counts
DO $$
BEGIN
  RAISE NOTICE 'Total venues created: %', (SELECT COUNT(*) FROM venues);
  RAISE NOTICE 'Budget venues (₹20k-50k): %', (SELECT COUNT(*) FROM venues WHERE weekday_price BETWEEN 20000 AND 50000);
  RAISE NOTICE 'Mid-range venues (₹50k-1L): %', (SELECT COUNT(*) FROM venues WHERE weekday_price BETWEEN 50000 AND 100000);
  RAISE NOTICE 'Premium venues (₹1L-3L): %', (SELECT COUNT(*) FROM venues WHERE weekday_price BETWEEN 100000 AND 300000);
  RAISE NOTICE 'Luxury venues (₹3L+): %', (SELECT COUNT(*) FROM venues WHERE weekday_price > 300000);
END $$;

-- ================================================================
-- DONE! 500+ venues with budget ranges created!
-- ================================================================
