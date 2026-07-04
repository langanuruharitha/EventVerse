import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIBlueprintInput, AIBlueprint } from '@/types/events';

// Initialize Gemini AI
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export class GeminiService {
  private model;

  constructor() {
    // Use gemini-1.5-flash for faster, cost-effective responses
    // If API key is invalid or missing, this will be handled in generateEventBlueprint
    try {
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });
    } catch (error) {
      console.warn('⚠️ Gemini model initialization failed, will use fallback');
    }
  }

  async generateEventBlueprint(input: AIBlueprintInput): Promise<{
    blueprint: AIBlueprint;
    tokensUsed: number;
    responseTimeMs: number;
  }> {
    const startTime = Date.now();

    // Check if API key exists
    if (!apiKey || apiKey.length < 20) {
      console.log('⚠️ Missing Gemini API key, using fallback template');
      return {
        blueprint: this.generateFallbackBlueprint(input),
        tokensUsed: 0,
        responseTimeMs: Date.now() - startTime,
      };
    }

    try {
      if (!this.model) {
        throw new Error('Model not initialized');
      }

      const prompt = this.buildBlueprintPrompt(input);
      console.log('🤖 Generating AI blueprint with Gemini...');

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ AI response received');

      // Parse the JSON response
      const blueprint = this.parseAIResponse(text, input);
      
      const responseTimeMs = Date.now() - startTime;

      return {
        blueprint,
        tokensUsed: this.estimateTokens(prompt + text),
        responseTimeMs,
      };
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      
      // Fallback to template-based blueprint
      console.log('⚠️ Using fallback template blueprint');
      return {
        blueprint: this.generateFallbackBlueprint(input),
        tokensUsed: 0,
        responseTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Build the AI prompt for blueprint generation
   */
  private buildBlueprintPrompt(input: AIBlueprintInput): string {
    const eventDate = new Date(input.event_date);
    const daysUntilEvent = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return `You are an expert Indian event planner. Create a comprehensive event plan in JSON format.

EVENT DETAILS:
- Event Type: ${input.event_type}
- Guest Count: ${input.guest_count} people
- Total Budget: ₹${input.total_budget.toLocaleString('en-IN')}
- Event Date: ${input.event_date} (${daysUntilEvent} days from now)
${input.theme ? `- Theme: ${input.theme}` : ''}
${input.venue_types ? `- Venue Preference: ${input.venue_types.join(', ')}` : ''}
${input.location ? `- Location: ${input.location}` : ''}
${input.event_timing ? `- Timing: ${input.event_timing}` : ''}
${input.special_requirements ? `- Special Requirements: ${input.special_requirements}` : ''}
${input.selected_addons ? `- Selected Add-ons: ${input.selected_addons.join(', ')}` : ''}

Please provide a detailed event plan with:
1. Budget breakdown by category (venue, food, decoration, photography, entertainment, etc.)
2. Task checklist with priorities and suggested completion dates
3. Timeline with key milestones
4. Shopping list categorized by type
5. Vendor recommendations with estimated costs
6. Decoration ideas
7. Food menu suggestions
8. Helpful planning tips

Format your response as valid JSON matching this structure:
{
  "budgetBreakdown": [
    {"category": "Venue", "amount": 15000, "percentage": 30, "icon": "🏛️"}
  ],
  "tasks": [
    {"category": "Venue", "task_name": "Book venue", "description": "Reserve the banquet hall", "priority": "high", "weeks_before": 6}
  ],
  "timeline": [
    {"milestone_name": "Venue Booking", "weeks_before": 6, "description": "Finalize and book venue", "category": "Venue", "tasks": ["Book venue", "Pay advance"]}
  ],
  "shoppingList": [
    {"category": "Decoration", "item_name": "Balloons", "quantity": 100, "estimated_price": 500, "priority": "medium", "where_to_buy": "Party supplies store"}
  ],
  "vendorRecommendations": [
    {"category": "Photography", "vendor_type": "Photographer", "estimated_cost": 8000, "tips": ["Book 2-3 months in advance", "Check portfolio"]}
  ],
  "decorationIdeas": "Elegant floral arrangements with pastel color theme...",
  "foodSuggestions": "Welcome drinks: Fresh juice and mocktails. Starters: Paneer tikka, spring rolls...",
  "tips": ["Start planning at least 2 months in advance", "Keep 10% budget as buffer"]
}

Use Indian market prices (INR). Be specific and practical. Focus on realistic, actionable advice.`;
  }

  /**
   * Parse AI response and structure it properly
   */
  private parseAIResponse(text: string, input: AIBlueprintInput): AIBlueprint {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsed = JSON.parse(cleanText);
      
      // Validate and ensure all required fields exist
      return {
        budgetBreakdown: parsed.budgetBreakdown || this.generateDefaultBudget(input.total_budget),
        tasks: parsed.tasks || [],
        timeline: parsed.timeline || [],
        shoppingList: parsed.shoppingList || [],
        vendorRecommendations: parsed.vendorRecommendations || [],
        decorationIdeas: parsed.decorationIdeas || 'Beautiful decorations matching your theme.',
        foodSuggestions: parsed.foodSuggestions || 'Delicious menu options for your guests.',
        tips: parsed.tips || ['Plan ahead', 'Keep buffer budget', 'Confirm vendors early'],
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Raw response:', text.substring(0, 500));
      
      // Return fallback
      return this.generateFallbackBlueprint(input);
    }
  }

  /**
   * Generate a fallback blueprint when AI fails
   */
  private generateFallbackBlueprint(input: AIBlueprintInput): AIBlueprint {
    const budget = input.total_budget;
    const guestCount = input.guest_count;
    const eventType = input.event_type;
    const theme = input.theme || 'elegant';
    const location = input.location || 'your city';
    const specialReqs = input.special_requirements || '';
    const addons = input.selected_addons || [];
    
    // Parse special requirements for detailed preferences
    const hasPhotography = addons.includes('photography') || specialReqs.toLowerCase().includes('photo');
    const hasDecoration = addons.includes('decoration') || specialReqs.toLowerCase().includes('decor');
    const hasCatering = addons.includes('catering') || specialReqs.toLowerCase().includes('food');
    const hasEntertainment = addons.includes('entertainment') || addons.includes('dj');
    
    // Extract food preferences from special requirements
    const foodPrefs = specialReqs.match(/Food Preferences: ([^.]+)/)?.[1] || 'mixed cuisine';
    const ageGroup = specialReqs.match(/Age Group: ([^.]+)/)?.[1] || 'mixed ages';
    const photoStyle = specialReqs.match(/Photography Style: ([^.]+)/)?.[1] || 'candid';
    const decorBudget = specialReqs.match(/Decoration Budget: ([^.]+)/)?.[1] || 'medium';

    return {
      budgetBreakdown: this.generateCustomBudget(budget, addons, guestCount),
      tasks: this.generateCustomTasks(eventType, addons, hasPhotography, hasCatering, hasDecoration),
      timeline: this.generateCustomTimeline(eventType),
      shoppingList: this.generateCustomShopping(eventType, guestCount, addons),
      vendorRecommendations: this.generateCustomVendors(budget, addons, location),
      decorationIdeas: this.generateDecorationIdeas(theme, decorBudget, eventType),
      foodSuggestions: this.generateFoodSuggestions(foodPrefs, guestCount, eventType),
      tips: this.generateCustomTips(eventType, ageGroup, specialReqs),
    };
  }

  /**
   * Generate custom budget breakdown based on user selections
   */
  private generateCustomBudget(totalBudget: number, addons: string[], guestCount: number) {
    const breakdown = [];
    let allocated = 0;

    // Venue (20-30% based on guest count)
    const venuePercent = guestCount > 100 ? 30 : 25;
    breakdown.push({ 
      category: 'Venue', 
      amount: Math.round(totalBudget * (venuePercent/100)), 
      percentage: venuePercent, 
      icon: '🏛️' 
    });
    allocated += venuePercent;

    // Food & Catering (30-40% if selected)
    if (addons.includes('catering')) {
      const foodPercent = 35;
      breakdown.push({ 
        category: 'Food & Catering', 
        amount: Math.round(totalBudget * (foodPercent/100)), 
        percentage: foodPercent, 
        icon: '🍽️' 
      });
      allocated += foodPercent;
    }

    // Decoration (10-20% if selected)
    if (addons.includes('decoration')) {
      const decorPercent = 15;
      breakdown.push({ 
        category: 'Decoration', 
        amount: Math.round(totalBudget * (decorPercent/100)), 
        percentage: decorPercent, 
        icon: '🎨' 
      });
      allocated += decorPercent;
    }

    // Photography (8-12% if selected)
    if (addons.includes('photography')) {
      const photoPercent = 10;
      breakdown.push({ 
        category: 'Photography & Videography', 
        amount: Math.round(totalBudget * (photoPercent/100)), 
        percentage: photoPercent, 
        icon: '📸' 
      });
      allocated += photoPercent;
    }

    // Entertainment/DJ (5-10% if selected)
    if (addons.includes('entertainment') || addons.includes('dj')) {
      const entertainPercent = 8;
      breakdown.push({ 
        category: 'Entertainment & DJ', 
        amount: Math.round(totalBudget * (entertainPercent/100)), 
        percentage: entertainPercent, 
        icon: '🎵' 
      });
      allocated += entertainPercent;
    }

    // Return Gifts (3-5% if selected)
    if (addons.includes('return_gifts')) {
      const giftPercent = 4;
      breakdown.push({ 
        category: 'Return Gifts', 
        amount: Math.round(totalBudget * (giftPercent/100)), 
        percentage: giftPercent, 
        icon: '🎁' 
      });
      allocated += giftPercent;
    }

    // Miscellaneous (remaining budget)
    const miscPercent = Math.max(5, 100 - allocated);
    breakdown.push({ 
      category: 'Miscellaneous & Contingency', 
      amount: Math.round(totalBudget * (miscPercent/100)), 
      percentage: miscPercent, 
      icon: '📋' 
    });

    return breakdown;
  }

  /**
   * Generate custom tasks based on selections
   */
  private generateCustomTasks(eventType: string, addons: string[], hasPhoto: boolean, hasCatering: boolean, hasDecor: boolean): Array<{
    category: string;
    task_name: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    weeks_before: number;
  }> {
    const tasks: Array<{
      category: string;
      task_name: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      weeks_before: number;
    }> = [
      { category: 'Venue', task_name: 'Research and shortlist venues', description: `Find venues suitable for ${eventType} in your area`, priority: 'high', weeks_before: 8 },
      { category: 'Venue', task_name: 'Book venue', description: 'Finalize and book the venue with advance payment', priority: 'critical', weeks_before: 6 },
    ];

    if (hasPhoto) {
      tasks.push({ category: 'Photography', task_name: 'Book photographer', description: 'Find and book professional photographer/videographer', priority: 'high', weeks_before: 6 });
      tasks.push({ category: 'Photography', task_name: 'Discuss shot list', description: 'Share must-have shots and moments to capture', priority: 'medium', weeks_before: 2 });
    }

    if (hasCatering) {
      tasks.push({ category: 'Catering', task_name: 'Finalize menu', description: 'Taste testing and menu finalization with caterer', priority: 'high', weeks_before: 5 });
      tasks.push({ category: 'Catering', task_name: 'Confirm guest count', description: 'Provide final headcount to caterer', priority: 'critical', weeks_before: 1 });
    }

    if (hasDecor) {
      tasks.push({ category: 'Decoration', task_name: 'Finalize decoration theme', description: 'Choose colors, flowers, and decoration style', priority: 'medium' as const, weeks_before: 4 });
      tasks.push({ category: 'Decoration', task_name: 'Venue decoration setup', description: 'Coordinate decoration setup on event day', priority: 'high' as const, weeks_before: 0 });
    }

    tasks.push(
      { category: 'Invitations', task_name: 'Design invitations', description: 'Create and finalize invitation design', priority: 'medium' as const, weeks_before: 4 },
      { category: 'Invitations', task_name: 'Send invitations', description: 'Distribute invitations to all guests', priority: 'high' as const, weeks_before: 3 },
      { category: 'Shopping', task_name: 'Purchase supplies', description: 'Buy all necessary party supplies and decorations', priority: 'medium' as const, weeks_before: 2 },
      { category: 'Final Check', task_name: 'Confirm all vendors', description: 'Reconfirm with venue, caterer, photographer, and other vendors', priority: 'critical' as const, weeks_before: 1 },
      { category: 'Final Check', task_name: 'Prepare day-of timeline', description: 'Create detailed schedule for the event day', priority: 'high' as const, weeks_before: 1 },
    );

    return tasks;
  }

  /**
   * Generate custom shopping list based on guest count and addons
   */
  private generateCustomShopping(eventType: string, guestCount: number, addons: string[]) {
    const items = [];

    if (addons.includes('decoration')) {
      items.push(
        { category: 'Decoration', item_name: 'Balloons (assorted colors)', quantity: Math.ceil(guestCount / 2), estimated_price: Math.ceil(guestCount / 2) * 5, priority: 'medium' as const, where_to_buy: 'Party supplies store' },
        { category: 'Decoration', item_name: 'Banners & Buntings', quantity: 5, estimated_price: 1000, priority: 'medium' as const, where_to_buy: 'Party supplies store' },
        { category: 'Decoration', item_name: 'Fairy lights (10m each)', quantity: 3, estimated_price: 600, priority: 'low' as const, where_to_buy: 'Online/Hardware stores' },
        { category: 'Decoration', item_name: 'Fresh flowers', quantity: 10, estimated_price: 2000, priority: 'high' as const, where_to_buy: 'Local flower market' },
      );
    }

    items.push(
      { category: 'Tableware', item_name: 'Disposable plates', quantity: guestCount, estimated_price: guestCount * 4, priority: 'high' as const, where_to_buy: 'Wholesale market' },
      { category: 'Tableware', item_name: 'Cups and napkins', quantity: guestCount, estimated_price: guestCount * 3, priority: 'high' as const, where_to_buy: 'Wholesale market' },
      { category: 'Tableware', item_name: 'Serving trays and bowls', quantity: 10, estimated_price: 800, priority: 'medium' as const, where_to_buy: 'Utensil store' },
    );

    if (addons.includes('return_gifts')) {
      items.push({ 
        category: 'Return Gifts', 
        item_name: 'Gift items for guests', 
        quantity: guestCount, 
        estimated_price: guestCount * 50, 
        priority: 'medium' as const, 
        where_to_buy: 'Gift shops/Online' 
      });
    }

    items.push(
      { category: 'Supplies', item_name: 'Welcome board/Standee', quantity: 1, estimated_price: 500, priority: 'low' as const, where_to_buy: 'Printing shop' },
      { category: 'Supplies', item_name: 'Guest register book', quantity: 1, estimated_price: 300, priority: 'low' as const, where_to_buy: 'Stationery store' },
    );

    return items;
  }

  /**
   * Generate custom vendor recommendations based on location and budget
   */
  private generateCustomVendors(budget: number, addons: string[], location: string) {
    const vendors = [];

    if (addons.includes('photography')) {
      vendors.push({
        category: 'Photography',
        vendor_type: 'Professional Photographer & Videographer',
        estimated_cost: Math.round(budget * 0.10),
        tips: [
          `Search for photographers in ${location} with good portfolios`,
          'Check previous work and client reviews',
          'Book 2-3 months in advance for best rates',
          'Discuss candid vs traditional style preferences'
        ],
      });
    }

    if (addons.includes('decoration')) {
      vendors.push({
        category: 'Decoration',
        vendor_type: 'Event Decoration Service',
        estimated_cost: Math.round(budget * 0.15),
        tips: [
          'Share reference images of your theme',
          'Visit their previous setups if possible',
          'Confirm setup and takedown timings',
          'Negotiate package deals for complete decoration'
        ],
      });
    }

    if (addons.includes('catering')) {
      vendors.push({
        category: 'Catering',
        vendor_type: 'Multi-Cuisine Caterer',
        estimated_cost: Math.round(budget * 0.35),
        tips: [
          'Arrange taste testing before finalizing',
          'Confirm menu 2 weeks prior to event',
          'Check if service staff is included',
          'Discuss dietary restrictions and special requests'
        ],
      });
    }

    if (addons.includes('entertainment') || addons.includes('dj')) {
      vendors.push({
        category: 'Entertainment',
        vendor_type: 'DJ & Sound System',
        estimated_cost: Math.round(budget * 0.08),
        tips: [
          'Share your music preferences and playlist',
          'Check sound system quality and backup equipment',
          'Discuss lighting and special effects',
          'Book early for weekend events'
        ],
      });
    }

    // Always recommend venue
    vendors.push({
      category: 'Venue',
      vendor_type: `Banquet Hall / Garden in ${location}`,
      estimated_cost: Math.round(budget * 0.25),
      tips: [
        'Visit venue during both day and night',
        'Check parking facilities and accessibility',
        'Confirm included amenities (AC, furniture, etc.)',
        'Ask about cancellation and refund policy'
      ],
    });

    return vendors;
  }

  /**
   * Generate decoration ideas based on theme
   */
  private generateDecorationIdeas(theme: string, decorBudget: string, eventType: string): string {
    const budgetLevel = decorBudget.toLowerCase();
    const eventDecor: Record<string, string> = {
      'birthday': 'colorful balloons, themed backdrops, photo booth area, cake table centerpiece',
      'wedding': 'floral mandap/arch, fairy lights, draped fabrics, elegant centerpieces, flower pathways',
      'engagement': 'romantic lighting, rose petals, personalized signage, photo display of couple',
      'baby-shower': 'pastel colors, cute baby-themed props, balloon ceiling, diaper cake display',
      'anniversary': 'photos timeline, romantic candles, flowers, anniversary year theme',
      'housewarming': 'traditional torans, rangoli, plants, warm lighting, welcome board',
      'corporate': 'professional banners, branded backdrops, stage setup, mood lighting',
      'festival': 'traditional decorations, ethnic props, colorful fabrics, themed installations',
    };

    const baseDecor = eventDecor[eventType] || 'elegant decorations with ambient lighting';
    
    if (budgetLevel.includes('lavish')) {
      return `Luxurious ${theme} themed decoration featuring ${baseDecor}. Premium fresh flowers, designer fabrics, professional lighting with spotlights and uplighting, custom-built structures, elaborate entrance gates, and personalized decorative elements throughout the venue. Consider hiring a professional decorator for end-to-end setup.`;
    } else if (budgetLevel.includes('minimal')) {
      return `Simple yet elegant ${theme} themed decoration with ${baseDecor}. Focus on key areas like entrance, stage/main area, and photo spots. Use DIY elements, paper decorations, and strategic lighting to create beautiful ambiance without overspending.`;
    } else {
      return `Beautiful ${theme} themed decoration featuring ${baseDecor}. Balanced mix of fresh and artificial flowers, elegant draping, ambient lighting, decorative centerpieces, and photo-worthy corners. Professional touch with reasonable budget allocation.`;
    }
  }

  /**
   * Generate food suggestions based on preferences
   */
  private generateFoodSuggestions(foodPrefs: string, guestCount: number, eventType: string): string {
    const isVeg = foodPrefs.toLowerCase().includes('vegetarian');
    const isNonVeg = foodPrefs.toLowerCase().includes('non-vegetarian');
    const isVegan = foodPrefs.toLowerCase().includes('vegan');
    const isContinental = foodPrefs.toLowerCase().includes('continental');
    const isChinese = foodPrefs.toLowerCase().includes('chinese');
    
    let menu = `Curated menu for ${guestCount} guests:\n\n`;
    
    menu += `**Welcome Drinks:**\n`;
    menu += `- Fresh fruit juice (orange, watermelon, mixed fruit)\n`;
    menu += `- Masala chai / Coffee\n`;
    menu += `- Flavored lemonade / Mocktails\n\n`;
    
    menu += `**Starters/Appetizers:**\n`;
    if (isVeg || !isNonVeg) {
      menu += `- Paneer tikka, Veg spring rolls, Corn cheese balls\n`;
      menu += `- Aloo tikki, Papdi chaat, Dahi puri\n`;
    }
    if (isNonVeg) {
      menu += `- Chicken tikka, Fish fingers, Mutton seekh kebab\n`;
      menu += `- Egg pakora, Prawn koliwada\n`;
    }
    if (isChinese) {
      menu += `- Veg/Chicken manchurian, Fried rice, Hakka noodles\n`;
    }
    
    menu += `\n**Main Course:**\n`;
    if (isVeg || !isNonVeg) {
      menu += `- Dal makhani, Paneer butter masala, Mix veg curry\n`;
      menu += `- Jeera rice, Veg biryani, Assorted breads (naan, roti)\n`;
    }
    if (isNonVeg) {
      menu += `- Butter chicken, Mutton rogan josh, Fish curry\n`;
      menu += `- Chicken biryani, Egg curry\n`;
    }
    if (isContinental) {
      menu += `- Pasta (white/red sauce), Grilled vegetables\n`;
      menu += `- Garlic bread, Continental salads\n`;
    }
    
    menu += `\n**Breads & Rice:**\n`;
    menu += `- Assorted naan (plain, butter, garlic)\n`;
    menu += `- Tandoori roti, Phulka\n`;
    menu += `- Jeera rice, Steamed rice\n`;
    
    menu += `\n**Desserts:**\n`;
    menu += `- Gulab jamun, Rasmalai, Ice cream\n`;
    menu += `- Fruit custard, Moong dal halwa\n`;
    if (eventType === 'birthday' || eventType === 'anniversary') {
      menu += `- Special celebration cake\n`;
    }
    
    if (isVegan) {
      menu += `\n**Vegan Options:**\n`;
      menu += `- Ensure all items use plant-based ingredients\n`;
      menu += `- Replace dairy with coconut milk/cashew cream\n`;
      menu += `- Vegan desserts: Date balls, fruit salad, sorbet\n`;
    }
    
    menu += `\n**Note:** Adjust quantities based on final guest count. Consider dietary restrictions and allergies.`;
    
    return menu;
  }

  /**
   * Generate custom tips based on event details
   */
  private generateCustomTips(eventType: string, ageGroup: string, specialReqs: string): string[] {
    const tips = [
      `Start planning at least 6-8 weeks in advance for ${eventType}`,
      'Keep 10-15% of budget as contingency for unexpected expenses',
    ];

    if (ageGroup.includes('kids') || ageGroup.includes('mixed')) {
      tips.push('Arrange kids-friendly activities and safe play area');
      tips.push('Keep first-aid kit handy and childproof the venue');
    }

    if (specialReqs.includes('Parking: Required')) {
      tips.push('Confirm parking capacity and valet service availability');
      tips.push('Share parking details in invitations');
    }

    if (specialReqs.includes('Photography')) {
      tips.push('Create a shot list of must-have moments and people');
      tips.push('Designate someone to coordinate with photographer');
    }

    tips.push(
      'Confirm all vendor bookings 2 weeks before event',
      'Create a detailed day-of timeline and share with team',
      'Delegate tasks to family and friends - don\'t do everything alone',
      'Keep vendor contacts handy for last-minute coordination',
      'Do a final venue walkthrough 2-3 days before event',
    );

    if (eventType === 'wedding' || eventType === 'engagement') {
      tips.push('Book accommodation for outstation guests in advance');
      tips.push('Arrange welcome kits for guests');
    }

    return tips;
  }

  /**
   * Generate custom timeline
   */
  private generateCustomTimeline(eventType: string) {
    return [
      {
        milestone_name: 'Initial Planning & Major Bookings',
        weeks_before: 8,
        description: 'Start planning and book major vendors',
        category: 'Planning',
        tasks: ['Set budget', 'Create guest list', 'Book venue', 'Book caterer'],
      },
      {
        milestone_name: 'Vendor Coordination',
        weeks_before: 6,
        description: 'Finalize all vendor bookings and services',
        category: 'Vendors',
        tasks: ['Book photographer', 'Book decorator', 'Book entertainment', 'Finalize menu'],
      },
      {
        milestone_name: 'Invitations & Guest Management',
        weeks_before: 4,
        description: 'Design and distribute invitations',
        category: 'Guests',
        tasks: ['Design invitations', 'Send invitations', 'Track RSVPs', 'Arrange accommodation'],
      },
      {
        milestone_name: 'Shopping & Preparation',
        weeks_before: 2,
        description: 'Purchase items and final preparations',
        category: 'Preparation',
        tasks: ['Buy supplies', 'Prepare return gifts', 'Finalize seating', 'Venue decoration planning'],
      },
      {
        milestone_name: 'Final Countdown',
        weeks_before: 1,
        description: 'Final confirmations and setup',
        category: 'Final',
        tasks: ['Confirm all vendors', 'Final guest count', 'Venue walkthrough', 'Day-of timeline'],
      },
    ];
  }

  /**
   * Generate default budget breakdown
   */
  private generateDefaultBudget(totalBudget: number) {
    return [
      { category: 'Venue', amount: Math.round(totalBudget * 0.25), percentage: 25, icon: '🏛️' },
      { category: 'Food & Catering', amount: Math.round(totalBudget * 0.35), percentage: 35, icon: '🍽️' },
      { category: 'Decoration', amount: Math.round(totalBudget * 0.15), percentage: 15, icon: '🎨' },
      { category: 'Photography', amount: Math.round(totalBudget * 0.10), percentage: 10, icon: '📸' },
      { category: 'Entertainment', amount: Math.round(totalBudget * 0.08), percentage: 8, icon: '🎭' },
      { category: 'Miscellaneous', amount: Math.round(totalBudget * 0.07), percentage: 7, icon: '📋' },
    ];
  }

  /**
   * Generate default tasks
   */
  private generateDefaultTasks(eventType: string) {
    return [
      { category: 'Venue', task_name: 'Book venue', description: 'Research and book the perfect venue', priority: 'high' as const, weeks_before: 6 },
      { category: 'Vendors', task_name: 'Book photographer', description: 'Find and book professional photographer', priority: 'high' as const, weeks_before: 6 },
      { category: 'Vendors', task_name: 'Book caterer', description: 'Finalize menu and book catering service', priority: 'high' as const, weeks_before: 5 },
      { category: 'Decoration', task_name: 'Finalize decoration theme', description: 'Choose colors and decoration style', priority: 'medium' as const, weeks_before: 4 },
      { category: 'Invitations', task_name: 'Send invitations', description: 'Design and send invitations to guests', priority: 'medium' as const, weeks_before: 3 },
      { category: 'Shopping', task_name: 'Purchase supplies', description: 'Buy all necessary party supplies', priority: 'medium' as const, weeks_before: 2 },
      { category: 'Final', task_name: 'Confirm all bookings', description: 'Reconfirm with all vendors', priority: 'critical' as const, weeks_before: 1 },
    ];
  }

  /**
   * Generate default timeline
   */
  private generateDefaultTimeline() {
    return [
      {
        milestone_name: 'Planning & Bookings',
        weeks_before: 6,
        description: 'Initial planning and major bookings',
        category: 'Planning',
        tasks: ['Book venue', 'Book vendors', 'Finalize budget'],
      },
      {
        milestone_name: 'Design & Invitations',
        weeks_before: 4,
        description: 'Finalize design and send invitations',
        category: 'Design',
        tasks: ['Finalize decoration theme', 'Design invitations', 'Send save-the-date'],
      },
      {
        milestone_name: 'Shopping & Preparation',
        weeks_before: 2,
        description: 'Purchase items and final preparations',
        category: 'Preparation',
        tasks: ['Buy supplies', 'Finalize menu', 'Prepare return gifts'],
      },
      {
        milestone_name: 'Final Countdown',
        weeks_before: 1,
        description: 'Final confirmations and setup',
        category: 'Final',
        tasks: ['Confirm all vendors', 'Final guest count', 'Setup checklist'],
      },
    ];
  }

  /**
   * Generate default shopping list
   */
  private generateDefaultShopping(eventType: string) {
    return [
      { category: 'Decoration', item_name: 'Balloons (pack of 100)', quantity: 2, estimated_price: 500, priority: 'medium' as const, where_to_buy: 'Party supplies store' },
      { category: 'Decoration', item_name: 'Banners & Buntings', quantity: 5, estimated_price: 800, priority: 'medium' as const, where_to_buy: 'Party supplies store' },
      { category: 'Decoration', item_name: 'Fairy lights', quantity: 3, estimated_price: 600, priority: 'low' as const, where_to_buy: 'Online/Local stores' },
      { category: 'Tableware', item_name: 'Disposable plates', quantity: 100, estimated_price: 400, priority: 'high' as const, where_to_buy: 'Supermarket' },
      { category: 'Tableware', item_name: 'Cups and napkins', quantity: 100, estimated_price: 300, priority: 'high' as const, where_to_buy: 'Supermarket' },
      { category: 'Gifts', item_name: 'Return gifts', quantity: 50, estimated_price: 2500, priority: 'medium' as const, where_to_buy: 'Gift shops' },
    ];
  }

  /**
   * Generate default vendor recommendations
   */
  private generateDefaultVendors(budget: number) {
    return [
      {
        category: 'Photography',
        vendor_type: 'Professional Photographer',
        estimated_cost: Math.round(budget * 0.10),
        tips: ['Check portfolio and reviews', 'Book 2-3 months in advance', 'Discuss photo/video package'],
      },
      {
        category: 'Decoration',
        vendor_type: 'Decoration Service',
        estimated_cost: Math.round(budget * 0.15),
        tips: ['Share reference images', 'Visit previous setups', 'Confirm setup time'],
      },
      {
        category: 'Catering',
        vendor_type: 'Catering Service',
        estimated_cost: Math.round(budget * 0.35),
        tips: ['Arrange taste testing', 'Confirm menu 2 weeks prior', 'Check service staff availability'],
      },
    ];
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
