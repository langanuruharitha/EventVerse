// Real Event Products with Unsplash Images (Free for Commercial Use)
// All images from Unsplash.com - No attribution required

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  eventType: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  images?: string[];
  description: string;
  shortDescription: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  tags: string[];
}

export const shopProducts: ShopProduct[] = [
  // ==================== WEDDING PRODUCTS ====================
  {
    id: 'PROD001',
    name: 'Premium Wedding Decoration Package - Flowers & Drapes',
    slug: 'premium-wedding-decoration-flowers-drapes',
    category: 'Decorations',
    eventType: ['wedding', 'engagement'],
    price: 15999,
    originalPrice: 22999,
    discountPercentage: 30,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      'https://images.unsplash.com/photo-1525258974266-5bea8e41e588?w=800'
    ],
    description: 'Transform your wedding venue with our premium decoration package featuring elegant floral arrangements, flowing drapes, and ambient lighting. Includes fresh flower bouquets, table centerpieces, backdrop setup, and professional installation.',
    shortDescription: 'Complete wedding decoration with flowers, drapes & lighting',
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 156,
    salesCount: 342,
    isFeatured: true,
    isBestseller: true,
    tags: ['wedding', 'flowers', 'decorations', 'premium', 'bestseller']
  },
  {
    id: 'PROD002',
    name: 'Elegant Bride & Groom Cake Topper Set',
    slug: 'elegant-bride-groom-cake-topper',
    category: 'Cake Decorations',
    eventType: ['wedding'],
    price: 899,
    originalPrice: 1299,
    discountPercentage: 31,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop',
    description: 'Beautiful handcrafted cake topper featuring bride and groom figurines. Made from premium materials with intricate detailing. Perfect keepsake for your special day.',
    shortDescription: 'Handcrafted wedding cake topper',
    inStock: true,
    stockQuantity: 150,
    rating: 4.9,
    reviewCount: 89,
    salesCount: 567,
    isFeatured: true,
    isBestseller: true,
    tags: ['wedding', 'cake', 'topper', 'decoration']
  },
  {
    id: 'PROD003',
    name: 'Wedding Photo Booth Props Kit (25 Pieces)',
    slug: 'wedding-photo-booth-props-kit',
    category: 'Photo Booth',
    eventType: ['wedding', 'engagement'],
    price: 1499,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
    description: 'Make your wedding photos memorable with our 25-piece photo booth props kit. Includes funny glasses, mustaches, speech bubbles, and themed signs.',
    shortDescription: '25 fun photo booth props for wedding',
    inStock: true,
    stockQuantity: 80,
    rating: 4.7,
    reviewCount: 124,
    salesCount: 289,
    isFeatured: true,
    isBestseller: false,
    tags: ['wedding', 'photo booth', 'props', 'entertainment']
  },
  {
    id: 'PROD004',
    name: 'Luxury Wedding Flower Bouquet - Mixed Roses',
    slug: 'luxury-wedding-flower-bouquet-roses',
    category: 'Flowers',
    eventType: ['wedding'],
    price: 2499,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop',
    description: 'Stunning bridal bouquet featuring premium mixed roses in white, pink, and cream. Hand-tied with satin ribbon. Fresh flowers delivered on your wedding day.',
    shortDescription: 'Premium rose bridal bouquet',
    inStock: true,
    stockQuantity: 40,
    rating: 5.0,
    reviewCount: 78,
    salesCount: 234,
    isFeatured: true,
    isBestseller: true,
    tags: ['wedding', 'flowers', 'bouquet', 'roses']
  },
  {
    id: 'PROD005',
    name: 'Wedding Ring Bearer Pillow - Ivory Lace',
    slug: 'wedding-ring-bearer-pillow-ivory',
    category: 'Accessories',
    eventType: ['wedding'],
    price: 699,
    image: 'https://images.unsplash.com/photo-1535424263334-b570d6c9f32a?w=800&auto=format&fit=crop',
    description: 'Beautiful ivory lace ring bearer pillow with pearl embellishments. Elegant design perfect for traditional or modern weddings.',
    shortDescription: 'Ivory lace ring bearer pillow',
    inStock: true,
    stockQuantity: 95,
    rating: 4.8,
    reviewCount: 45,
    salesCount: 178,
    isFeatured: false,
    isBestseller: false,
    tags: ['wedding', 'rings', 'accessories']
  },

  // ==================== BIRTHDAY PRODUCTS ====================
  {
    id: 'PROD006',
    name: 'Birthday Balloon Decoration Set - 50 Pieces (Multi-Color)',
    slug: 'birthday-balloon-decoration-set-50pcs',
    category: 'Decorations',
    eventType: ['birthday'],
    price: 799,
    originalPrice: 1199,
    discountPercentage: 33,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
    description: 'Complete birthday balloon decoration set with 50 colorful balloons including latex balloons, foil number balloons, and confetti balloons. Perfect for all ages!',
    shortDescription: '50-piece colorful balloon decoration set',
    inStock: true,
    stockQuantity: 200,
    rating: 4.6,
    reviewCount: 312,
    salesCount: 892,
    isFeatured: true,
    isBestseller: true,
    tags: ['birthday', 'balloons', 'decorations', 'colorful', 'bestseller']
  },
  {
    id: 'PROD007',
    name: 'Happy Birthday Banner & Bunting Set - Gold Rose',
    slug: 'happy-birthday-banner-bunting-gold-rose',
    category: 'Decorations',
    eventType: ['birthday'],
    price: 449,
    image: 'https://images.unsplash.com/photo-1464198016405-ee304365c3b7?w=800&auto=format&fit=crop',
    description: 'Elegant gold and rose gold happy birthday banner with matching bunting flags. Reusable and perfect for Instagram-worthy celebrations.',
    shortDescription: 'Gold rose birthday banner set',
    inStock: true,
    stockQuantity: 175,
    rating: 4.7,
    reviewCount: 189,
    salesCount: 456,
    isFeatured: true,
    isBestseller: false,
    tags: ['birthday', 'banner', 'decorations', 'gold']
  },
  {
    id: 'PROD008',
    name: 'Birthday Cake Number Candles Set (0-9)',
    slug: 'birthday-cake-number-candles-set',
    category: 'Cake Decorations',
    eventType: ['birthday'],
    price: 299,
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&auto=format&fit=crop',
    description: 'Complete set of number candles 0-9 with glitter finish. Perfect for milestone birthdays. Smokeless and long-lasting.',
    shortDescription: 'Glitter number candles (0-9)',
    inStock: true,
    stockQuantity: 250,
    rating: 4.5,
    reviewCount: 267,
    salesCount: 1024,
    isFeatured: false,
    isBestseller: true,
    tags: ['birthday', 'cake', 'candles', 'numbers']
  },
  {
    id: 'PROD009',
    name: 'Birthday Party Hat Pack - 10 Pieces (Assorted Colors)',
    slug: 'birthday-party-hat-pack-10pcs',
    category: 'Party Supplies',
    eventType: ['birthday'],
    price: 349,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop',
    description: 'Fun party hats in assorted bright colors with elastic chin straps. Perfect for kids and adults. Pack of 10.',
    shortDescription: 'Colorful party hat pack (10pcs)',
    inStock: true,
    stockQuantity: 320,
    rating: 4.4,
    reviewCount: 156,
    salesCount: 678,
    isFeatured: false,
    isBestseller: false,
    tags: ['birthday', 'party', 'hats', 'fun']
  },
  {
    id: 'PROD010',
    name: 'Birthday Party Tableware Set - Serves 20 People',
    slug: 'birthday-party-tableware-set-20',
    category: 'Party Supplies',
    eventType: ['birthday'],
    price: 899,
    image: 'https://images.unsplash.com/photo-1567696153798-5ebeb43e67b0?w=800&auto=format&fit=crop',
    description: 'Complete disposable tableware set including plates, cups, napkins, and cutlery for 20 people. Eco-friendly materials.',
    shortDescription: 'Complete party tableware for 20',
    inStock: true,
    stockQuantity: 145,
    rating: 4.6,
    reviewCount: 98,
    salesCount: 345,
    isFeatured: false,
    isBestseller: false,
    tags: ['birthday', 'party', 'tableware', 'eco-friendly']
  },

  // ==================== BABY SHOWER PRODUCTS ====================
  {
    id: 'PROD011',
    name: 'Baby Shower Decoration Kit - Pink (Girl)',
    slug: 'baby-shower-decoration-kit-pink',
    category: 'Decorations',
    eventType: ['baby-shower'],
    price: 1299,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop',
    description: 'Adorable pink-themed baby shower decoration kit including balloons, banners, pom-poms, and table centerpieces. Perfect for celebrating baby girls!',
    shortDescription: 'Pink baby shower decoration kit',
    inStock: true,
    stockQuantity: 85,
    rating: 4.8,
    reviewCount: 124,
    salesCount: 267,
    isFeatured: true,
    isBestseller: false,
    tags: ['baby shower', 'decorations', 'pink', 'girl']
  },
  {
    id: 'PROD012',
    name: 'Baby Shower Decoration Kit - Blue (Boy)',
    slug: 'baby-shower-decoration-kit-blue',
    category: 'Decorations',
    eventType: ['baby-shower'],
    price: 1299,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop',
    description: 'Charming blue-themed baby shower decoration kit with balloons, "It\'s a Boy" banner, and hanging decorations.',
    shortDescription: 'Blue baby shower decoration kit',
    inStock: true,
    stockQuantity: 92,
    rating: 4.7,
    reviewCount: 108,
    salesCount: 234,
    isFeatured: true,
    isBestseller: false,
    tags: ['baby shower', 'decorations', 'blue', 'boy']
  },

  // ==================== CORPORATE EVENT PRODUCTS ====================
  {
    id: 'PROD013',
    name: 'Corporate Event Banner - Custom Printing Available',
    slug: 'corporate-event-banner-custom',
    category: 'Banners',
    eventType: ['corporate'],
    price: 1999,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
    description: 'Professional quality banner for corporate events, conferences, and seminars. Custom printing available with your company logo and event details.',
    shortDescription: 'Professional corporate event banner',
    inStock: true,
    stockQuantity: 50,
    rating: 4.9,
    reviewCount: 67,
    salesCount: 189,
    isFeatured: true,
    isBestseller: false,
    tags: ['corporate', 'banner', 'professional', 'custom']
  },
  {
    id: 'PROD014',
    name: 'Conference Name Badge Kit - 100 Pieces',
    slug: 'conference-name-badge-kit-100',
    category: 'Accessories',
    eventType: ['corporate'],
    price: 599,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    description: 'Professional name badge holders with lanyards. Perfect for conferences, seminars, and corporate events. Pack of 100.',
    shortDescription: 'Name badge kit (100 pieces)',
    inStock: true,
    stockQuantity: 120,
    rating: 4.5,
    reviewCount: 45,
    salesCount: 156,
    isFeatured: false,
    isBestseller: false,
    tags: ['corporate', 'badges', 'conference']
  },

  // ==================== ENGAGEMENT PRODUCTS ====================
  {
    id: 'PROD015',
    name: 'Engagement Ring Box - Velvet Luxury',
    slug: 'engagement-ring-box-velvet',
    category: 'Accessories',
    eventType: ['engagement'],
    price: 499,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
    description: 'Premium velvet ring box in burgundy or navy blue. Perfect for presenting the engagement ring. LED light option available.',
    shortDescription: 'Luxury velvet engagement ring box',
    inStock: true,
    stockQuantity: 180,
    rating: 4.9,
    reviewCount: 234,
    salesCount: 567,
    isFeatured: true,
    isBestseller: true,
    tags: ['engagement', 'ring box', 'luxury']
  },
  {
    id: 'PROD016',
    name: 'Engagement Photo Frame - "She Said Yes!"',
    slug: 'engagement-photo-frame-she-said-yes',
    category: 'Decorations',
    eventType: ['engagement'],
    price: 799,
    image: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800&auto=format&fit=crop',
    description: 'Beautiful wooden photo frame with "She Said Yes!" engraving. Perfect gift and keepsake for engaged couples.',
    shortDescription: 'Engraved engagement photo frame',
    inStock: true,
    stockQuantity: 95,
    rating: 4.7,
    reviewCount: 78,
    salesCount: 234,
    isFeatured: false,
    isBestseller: false,
    tags: ['engagement', 'photo frame', 'gift']
  },

  // ==================== ANNIVERSARY PRODUCTS ====================
  {
    id: 'PROD017',
    name: 'Anniversary Decoration Kit - Red & Gold',
    slug: 'anniversary-decoration-kit-red-gold',
    category: 'Decorations',
    eventType: ['anniversary'],
    price: 1499,
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop',
    description: 'Romantic anniversary decoration kit with red and gold balloons, heart-shaped decorations, and "Happy Anniversary" banner.',
    shortDescription: 'Red & gold anniversary decoration',
    inStock: true,
    stockQuantity: 110,
    rating: 4.8,
    reviewCount: 145,
    salesCount: 389,
    isFeatured: true,
    isBestseller: false,
    tags: ['anniversary', 'decorations', 'romantic']
  },
  {
    id: 'PROD018',
    name: 'Anniversary Photo Collage Frame - 12 Photos',
    slug: 'anniversary-photo-collage-frame-12',
    category: 'Decorations',
    eventType: ['anniversary'],
    price: 1299,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop',
    description: 'Large wooden collage frame for 12 photos. Perfect for showcasing memories from your journey together.',
    shortDescription: '12-photo anniversary collage frame',
    inStock: true,
    stockQuantity: 75,
    rating: 4.6,
    reviewCount: 89,
    salesCount: 178,
    isFeatured: false,
    isBestseller: false,
    tags: ['anniversary', 'photo frame', 'memories']
  },

  // ==================== PARTY SUPPLIES ====================
  {
    id: 'PROD019',
    name: 'LED String Lights - Warm White (10 Meters)',
    slug: 'led-string-lights-warm-white-10m',
    category: 'Lighting',
    eventType: ['wedding', 'birthday', 'anniversary', 'engagement'],
    price: 799,
    image: 'https://images.unsplash.com/photo-1515600051222-a3c338ff16f6?w=800&auto=format&fit=crop',
    description: 'Beautiful warm white LED string lights perfect for any event. 10 meters long with 100 LED bulbs. Waterproof and energy efficient.',
    shortDescription: 'Warm white LED lights (10m)',
    inStock: true,
    stockQuantity: 250,
    rating: 4.7,
    reviewCount: 456,
    salesCount: 1234,
    isFeatured: true,
    isBestseller: true,
    tags: ['lighting', 'LED', 'decorations', 'all events']
  },
  {
    id: 'PROD020',
    name: 'Confetti Cannon Set - Multicolor (6 Pieces)',
    slug: 'confetti-cannon-set-multicolor-6',
    category: 'Party Supplies',
    eventType: ['wedding', 'birthday', 'anniversary'],
    price: 699,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
    description: 'Fun confetti cannons for celebrations! Pack of 6 with multicolor biodegradable confetti. Easy to use and creates magical moments.',
    shortDescription: 'Confetti cannon party pack (6pcs)',
    inStock: true,
    stockQuantity: 180,
    rating: 4.8,
    reviewCount: 234,
    salesCount: 678,
    isFeatured: true,
    isBestseller: true,
    tags: ['party', 'confetti', 'celebration', 'fun']
  }
];

// Helper functions
export function getProductsByCategory(category: string): ShopProduct[] {
  return shopProducts.filter(p => p.category === category);
}

export function getProductsByEventType(eventType: string): ShopProduct[] {
  return shopProducts.filter(p => p.eventType.includes(eventType));
}

export function getFeaturedProducts(): ShopProduct[] {
  return shopProducts.filter(p => p.isFeatured);
}

export function getBestsellers(): ShopProduct[] {
  return shopProducts.filter(p => p.isBestseller).sort((a, b) => b.salesCount - a.salesCount);
}

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find(p => p.slug === slug);
}
