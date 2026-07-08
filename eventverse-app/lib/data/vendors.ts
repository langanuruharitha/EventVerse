// Sample vendors database - 200+ vendors across India
// Categories: Photography, Catering, Decoration, Entertainment, Venue, Painting, Total Event Management

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  state: string;
  image: string;
  description: string;
  services: string[];
  verified: boolean;
}

// Major Indian cities by state
const LOCATIONS = [
  // Maharashtra
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Nashik', state: 'Maharashtra' },
  // Delhi NCR
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Gurgaon', state: 'Haryana' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  // Karnataka
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Mysore', state: 'Karnataka' },
  { city: 'Mangalore', state: 'Karnataka' },
  // Tamil Nadu
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Madurai', state: 'Tamil Nadu' },
  // Telangana & Andhra Pradesh
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { city: 'Vijayawada', state: 'Andhra Pradesh' },
  // West Bengal
  { city: 'Kolkata', state: 'West Bengal' },
  // Gujarat
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Vadodara', state: 'Gujarat' },
  // Rajasthan
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan' },
  { city: 'Jodhpur', state: 'Rajasthan' },
  // Kerala
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Thiruvananthapuram', state: 'Kerala' },
  // Punjab
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Ludhiana', state: 'Punjab' },
  // Madhya Pradesh
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
];

// Vendor name templates by category
const VENDOR_NAMES = {
  Photography: [
    'Elite Photography', 'Perfect Moments', 'Lens & Light', 'Capture Studio',
    'Visual Arts', 'Frame Perfect', 'Snap Magic', 'Picture Palace',
    'Photo Elite', 'Creative Lens', 'Memory Makers', 'Candid Clicks',
    'Pixel Perfect', 'Photo Fusion', 'Shutter Speed', 'Focus Studio',
    'Image Craft', 'Lens Masters', 'Click Art', 'Vision Studio'
  ],
  Catering: [
    'Royal Caterers', 'Spice Garden', 'Tasty Treats', 'Gourmet Kitchen',
    'Food Paradise', 'Culinary Delights', 'Flavour House', 'Tasty Bites',
    'Kitchen Magic', 'Food Fusion', 'Spice Route', 'Delicious Catering',
    'Feast Masters', 'Savory Kitchen', 'Food Gallery', 'Taste Buds',
    'Culinary Arts', 'Food Express', 'Kitchen Tales', 'Flavor Zone'
  ],
  Decoration: [
    'Dream Decorators', 'Bloom & Blossom', 'Decor Magic', 'Style Studio',
    'Elegant Decor', 'Festive Touch', 'Design Dreams', 'Decor Paradise',
    'Creative Decorations', 'Aesthetic Decor', 'Fancy Decorators', 'Decor Hub',
    'Event Elegance', 'Decoration World', 'Style Decor', 'Decorative Arts',
    'Glamour Decor', 'Festive Decorators', 'Decor Express', 'Theme Decorators'
  ],
  Entertainment: [
    'Beats & Rhythm DJ', 'Magic Show Entertainment', 'Event Pulse DJ',
    'Star Performers', 'Entertainment Hub', 'Live Band Studio', 'Party Rockers',
    'Dance Troupe', 'Music Mania', 'DJ Masters', 'Live Entertainment',
    'Performance Arts', 'Entertainment Express', 'Show Stoppers', 'Party DJ',
    'Music Studio', 'Entertainment World', 'Stage Masters', 'Live Shows', 'Party Entertainment'
  ],
  Venue: [
    'Grand Banquet Hall', 'Royal Palace Venue', 'Elite Convention Center',
    'Wedding Garden', 'Event Space', 'Celebration Hall', 'Premium Venues',
    'Party Hall', 'Luxury Banquet', 'Garden Venue', 'Marriage Hall',
    'Convention Center', 'Outdoor Venue', 'Resort Venue', 'Hotel Banquet',
    'Farmhouse Venue', 'Lawn Garden', 'Destination Venue', 'Event Complex', 'Celebration Space'
  ],
  Painting: [
    'Face Painting Studio', 'Creative Painters', 'Art & Colors', 'Painting Express',
    'Face Art Studio', 'Body Art', 'Creative Canvas', 'Paint Magic',
    'Art Studio', 'Color Splash', 'Face Art Masters', 'Painting Paradise',
    'Creative Arts', 'Face Design Studio', 'Art Express', 'Color Studio',
    'Painting World', 'Creative Face Art', 'Art Gallery', 'Paint Studio'
  ],
  'Total Event Management': [
    'Complete Events', 'Total Event Solutions', 'Event Masters', 'Full Service Events',
    'Event Planners Pro', 'Complete Event Management', 'Event Experts', 'Total Planning',
    'Event Solutions', 'Complete Party Planners', 'Event Management Co', 'Full Event Services',
    'Professional Event Planners', 'Complete Event Services', 'Event Wizards', 'Total Event Care',
    'Event Organizers', 'Complete Event Company', 'Event Management Hub', 'Total Event Experts'
  ]
};

// Generate vendors function (called once to create static data)
function generateVendors(): Vendor[] {
  const vendors: Vendor[] = [];
  let vendorId = 1;

  // Generate vendors for each category - distribute across ALL cities
  Object.entries(VENDOR_NAMES).forEach(([category, names]) => {
    names.forEach((baseName, nameIndex) => {
      // Create vendors for EVERY location (not just 2)
      LOCATIONS.forEach((location, locIndex) => {
        const vendor: Vendor = {
          id: vendorId.toString(),
          name: `${baseName} ${location.city}`,
          category,
          // Use deterministic rating based on vendor ID (not random)
          rating: Number((4.3 + ((vendorId % 7) / 10)).toFixed(1)), // 4.3 to 5.0 deterministic
          reviews: 50 + ((vendorId * 13) % 300), // 50-350 reviews deterministic
          priceRange: '',
          minPrice: 0,
          maxPrice: 0,
          location: location.city,
          state: location.state,
          image: getCategoryIcon(category),
          description: getDescription(category, baseName),
          services: getServices(category),
          verified: (vendorId % 10) > 2 // 70% verified, deterministic
        };

        // Set pricing based on category with some location variance
        const pricing = getPricing(category);
        // Add deterministic variance based on vendor ID (not random)
        const variance = 0.9 + ((vendorId % 20) / 100); // 0.9 to 1.1, deterministic
        vendor.minPrice = Math.floor(pricing.min * variance);
        vendor.maxPrice = Math.floor(pricing.max * variance);
        
        // Update price range based on actual prices
        if (category === 'Catering') {
          vendor.priceRange = `₹${vendor.minPrice} - ₹${vendor.maxPrice}/plate`;
        } else if (category === 'Venue') {
          vendor.priceRange = `₹${(vendor.minPrice / 1000).toFixed(0)}k - ₹${(vendor.maxPrice / 1000).toFixed(0)}k/day`;
        } else {
          vendor.priceRange = `₹${(vendor.minPrice / 1000).toFixed(0)}k - ₹${(vendor.maxPrice / 1000).toFixed(0)}k`;
        }

        vendors.push(vendor);
        vendorId++;
      });
    });
  });

  return vendors;
}

// Generate vendors once and export as constant
export const SAMPLE_VENDORS: Vendor[] = generateVendors();

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Photography': '📸',
    'Catering': '🍽️',
    'Decoration': '🎨',
    'Entertainment': '🎵',
    'Venue': '🏛️',
    'Painting': '🎭',
    'Total Event Management': '📋'
  };
  return icons[category] || '🎉';
}

function getDescription(category: string, baseName: string): string {
  const descriptions: Record<string, string[]> = {
    'Photography': [
      `Professional event photography with 10+ years experience. Specializing in candid moments and cinematic storytelling. Award-winning portfolio with 500+ happy clients.`,
      `Creative photography studio capturing emotions and memories. Expert in traditional, candid, and cinematic styles. Featured in top wedding magazines.`,
      `Premier photography services with state-of-the-art equipment. Drone coverage, 4K video, and same-day photo delivery available. 100% satisfaction guaranteed.`,
    ],
    'Catering': [
      `Multi-cuisine catering service with master chefs. From 50 to 5000 guests. Live counters, customized menus, and hygiene certified. Vegetarian and non-vegetarian options.`,
      `Authentic flavors with modern presentation. Specialized in Indian, Continental, Chinese, and fusion cuisines. Farm-to-table ingredients, no compromise on quality.`,
      `Complete food solution with professional staff. Buffet, plated service, and cocktail options. Diet-specific menus including vegan, keto, and gluten-free available.`,
    ],
    'Decoration': [
      `Theme-based decoration transforming venues into dream spaces. Fresh flowers, premium fabrics, and LED lighting. 1000+ successful events. Free consultation and 3D preview.`,
      `Creative decoration with attention to detail. Stage setup, entrance gates, ceiling drapes, and centerpieces. Budget-friendly to luxury packages available.`,
      `Exclusive decoration services with international standards. Balloon art, floral arrangements, and custom props. Eco-friendly decoration options available.`,
    ],
    'Entertainment': [
      `High-energy entertainment keeping your guests engaged. Professional DJs, latest sound systems, and LED dance floors. Bollywood, EDM, Retro - all genres covered.`,
      `Complete entertainment package with live performances. Musicians, dancers, comedians, and anchors. Customized playlist and interactive games for guests.`,
      `Premium entertainment services with experienced artists. Sound, lighting, and special effects. Live band, DJ, and celebrity performances available.`,
    ],
    'Venue': [
      `Spacious venue with modern amenities and elegant interiors. AC halls, outdoor gardens, and rooftop spaces. Ample parking, generator backup, and in-house catering facilities.`,
      `Premium banquet hall perfect for all occasions. Seating capacity from 100-1000 guests. Customizable lighting, stage, and decor. Convenient location with easy accessibility.`,
      `Luxury venue with breathtaking ambiance. Indoor and outdoor options with scenic views. Premium furniture, VIP lounges, and bridal changing rooms available.`,
    ],
    'Painting': [
      `Professional face painting and body art services. Safe, non-toxic, hypoallergenic colors. Trained artists creating magical designs for kids and adults. Perfect for themed parties.`,
      `Creative face painting with wide range of designs. Superheroes, animals, flowers, and custom requests. Quick service, photo-friendly designs. Makes every child feel special.`,
      `Expert body art and temporary tattoo services. Henna, glitter tattoos, and airbrush designs. Suitable for all age groups. Adds fun element to any celebration.`,
    ],
    'Total Event Management': [
      `End-to-end event management taking care of every detail. From concept to execution, we handle everything. Vendor coordination, timeline management, and on-site supervision. Stress-free planning guaranteed.`,
      `Complete event planning and execution services. Expert team managing venues, catering, decoration, entertainment, and logistics. Single point of contact for all your needs.`,
      `Professional event management with proven track record. Budget planning, vendor negotiation, guest management, and emergency handling. Making your special day perfect and memorable.`,
    ]
  };
  
  const categoryDescriptions = descriptions[category] || [
    `Professional ${category.toLowerCase()} services for all types of events. Experienced team, quality service, and customer satisfaction guaranteed.`
  ];
  
  // Use baseName hash to select description (deterministic)
  const hash = baseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return categoryDescriptions[hash % categoryDescriptions.length];
}

function getServices(category: string): string[] {
  const services: Record<string, string[]> = {
    'Photography': ['Photography', 'Videography', 'Drone Coverage', 'Photo Editing', 'Album Design'],
    'Catering': ['Multi-Cuisine', 'Live Counters', 'Custom Menus', 'Dessert Stations', 'Beverages'],
    'Decoration': ['Theme Decoration', 'Floral Arrangements', 'Lighting', 'Stage Setup', 'Entrance Decor'],
    'Entertainment': ['DJ Services', 'Live Band', 'Dance Performances', 'MC Services', 'Sound System'],
    'Venue': ['AC Halls', 'Parking', 'Catering Facilities', 'Stage', 'Green Rooms'],
    'Painting': ['Face Painting', 'Body Art', 'Temporary Tattoos', 'Glitter Art', 'Theme Designs'],
    'Total Event Management': ['Complete Planning', 'Vendor Coordination', 'Budget Management', 'Timeline Creation', 'On-site Management']
  };
  return services[category] || ['Professional Services'];
}

function getPricing(category: string): { min: number; max: number; range: string } {
  const pricing: Record<string, { min: number; max: number }> = {
    'Photography': { min: 15000, max: 80000 },
    'Catering': { min: 400, max: 1500 }, // per plate
    'Decoration': { min: 20000, max: 300000 },
    'Entertainment': { min: 10000, max: 50000 },
    'Venue': { min: 50000, max: 500000 },
    'Painting': { min: 5000, max: 25000 },
    'Total Event Management': { min: 100000, max: 1000000 }
  };

  const prices = pricing[category] || { min: 10000, max: 100000 };
  
  let range = '';
  if (category === 'Catering') {
    range = `₹${prices.min} - ₹${prices.max}/plate`;
  } else if (category === 'Venue') {
    range = `₹${(prices.min / 1000).toFixed(0)}k - ₹${(prices.max / 1000).toFixed(0)}k/day`;
  } else {
    range = `₹${(prices.min / 1000).toFixed(0)}k - ₹${(prices.max / 1000).toFixed(0)}k`;
  }

  return { min: prices.min, max: prices.max, range };
}

// Export categories for filters
export const VENDOR_CATEGORIES = [
  'Photography',
  'Catering',
  'Decoration',
  'Entertainment',
  'Painting',
  'Total Event Management'
];

// Export unique locations
export const VENDOR_LOCATIONS = Array.from(new Set(SAMPLE_VENDORS.map(v => v.location))).sort();

// Export unique states
export const VENDOR_STATES = Array.from(new Set(LOCATIONS.map(l => l.state))).sort();
