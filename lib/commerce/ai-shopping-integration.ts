'use server';

import { createServerClient } from '@/lib/supabase/server';
import { addToCart } from './cart-service';

export interface AIShoppingItem {
  item_name: string;
  category: string;
  quantity: number;
  estimated_price: number;
  priority: string;
}

export interface ProductMatch {
  product: any;
  matchScore: number;
  priceDiff: number;
}

export interface ConversionResult {
  added: Array<{ item: AIShoppingItem; product: any }>;
  notFound: AIShoppingItem[];
  outOfStock: Array<{ item: AIShoppingItem; product: any }>;
  alternatives: Array<{ item: AIShoppingItem; products: any[] }>;
  matchRate: number;
}

/**
 * Convert AI shopping list to cart items
 */
export async function convertShoppingListToCart(
  eventId: string
): Promise<{ success: boolean; data?: ConversionResult; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get event with shopping list
    const { data: event } = await supabase
      .from('events')
      .select('ai_blueprint')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();

    if (!event || !event.ai_blueprint?.shoppingList) {
      return { success: false, error: 'Shopping list not found' };
    }

    const shoppingList: AIShoppingItem[] = event.ai_blueprint.shoppingList;

    const result: ConversionResult = {
      added: [],
      notFound: [],
      outOfStock: [],
      alternatives: [],
      matchRate: 0,
    };

    // Process each shopping list item
    for (const item of shoppingList) {
      // Search for matching products
      const matches = await searchProductsByName(item.item_name, item.category);

      if (matches.length === 0) {
        result.notFound.push(item);
        
        // Find similar products
        const similar = await findSimilarProducts(item);
        if (similar.length > 0) {
          result.alternatives.push({ item, products: similar });
        }
        continue;
      }

      // Select best match
      const bestMatch = selectBestProduct(matches, item.estimated_price);

      // Check stock availability
      if (bestMatch.product.stock_quantity < item.quantity) {
        result.outOfStock.push({ item, product: bestMatch.product });
        
        // Find alternatives with stock
        const inStockAlternatives = matches
          .filter(m => m.product.stock_quantity >= item.quantity)
          .slice(0, 3);
        
        if (inStockAlternatives.length > 0) {
          result.alternatives.push({
            item,
            products: inStockAlternatives.map(m => m.product),
          });
        }
        continue;
      }

      // Add to cart
      const addResult = await addToCart({
        productId: bestMatch.product.id,
        quantity: item.quantity,
        isAiRecommended: true,
      });

      if (addResult.success) {
        result.added.push({ item, product: bestMatch.product });
      }
    }

    // Calculate match rate
    const totalItems = shoppingList.length;
    const matchedItems = result.added.length;
    result.matchRate = totalItems > 0 ? (matchedItems / totalItems) * 100 : 0;

    return { success: true, data: result };
  } catch (error) {
    console.error('Error converting shopping list:', error);
    return { success: false, error: 'Failed to convert shopping list' };
  }
}

/**
 * Search products by name and category
 */
async function searchProductsByName(
  name: string,
  category: string
): Promise<ProductMatch[]> {
  const supabase = await createServerClient();

  // Extract keywords from name
  const keywords = name.toLowerCase().split(' ');

  // Search products
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

  // Apply category filter if available
  if (category) {
    // Get category ID
    const { data: cat } = await supabase
      .from('product_categories')
      .select('id')
      .ilike('name', `%${category}%`)
      .single();

    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  const { data: products } = await query.limit(10);

  if (!products) return [];

  // Calculate match scores
  return products.map(product => {
    const matchScore = calculateMatchScore(product, keywords);
    const priceDiff = 0; // We'll calculate this in selectBestProduct
    return { product, matchScore, priceDiff };
  }).filter(m => m.matchScore > 0.3) // Only keep decent matches
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculate product match score
 */
function calculateMatchScore(product: any, keywords: string[]): number {
  const productName = product.name.toLowerCase();
  const productDesc = (product.short_description || '').toLowerCase();
  const productTags = (product.tags || []).join(' ').toLowerCase();

  let score = 0;
  let matches = 0;

  for (const keyword of keywords) {
    // Check name (highest weight)
    if (productName.includes(keyword)) {
      score += 0.5;
      matches++;
    }
    // Check description
    if (productDesc.includes(keyword)) {
      score += 0.3;
      matches++;
    }
    // Check tags
    if (productTags.includes(keyword)) {
      score += 0.2;
      matches++;
    }
  }

  // Normalize by number of keywords
  return keywords.length > 0 ? Math.min(score / keywords.length, 1) : 0;
}

/**
 * Select best product from matches
 */
function selectBestProduct(
  matches: ProductMatch[],
  targetPrice?: number
): ProductMatch {
  if (matches.length === 0) {
    throw new Error('No matches to select from');
  }

  // Calculate price difference for each match
  const matchesWithPrice = matches.map(match => ({
    ...match,
    priceDiff: targetPrice ? Math.abs(match.product.price - targetPrice) : 0,
  }));

  // Score each match
  return matchesWithPrice.reduce((best, current) => {
    const bestScore = calculateSelectionScore(best, targetPrice);
    const currentScore = calculateSelectionScore(current, targetPrice);
    return currentScore > bestScore ? current : best;
  });
}

/**
 * Calculate selection score for product
 */
function calculateSelectionScore(match: ProductMatch, targetPrice?: number): number {
  let score = 0;

  // Match score (40% weight)
  score += match.matchScore * 40;

  // Price match (30% weight)
  if (targetPrice && targetPrice > 0) {
    const priceDiff = Math.abs(match.product.price - targetPrice);
    const priceRatio = priceDiff / targetPrice;
    score += Math.max(0, (1 - priceRatio)) * 30;
  } else {
    score += 15; // Neutral if no target price
  }

  // Rating (20% weight)
  const ratingScore = (match.product.rating_average / 5) * 20;
  score += ratingScore;

  // Popularity (10% weight)
  const popularityScore = Math.min(match.product.sales_count / 100, 1) * 10;
  score += popularityScore;

  return score;
}

/**
 * Find similar products
 */
async function findSimilarProducts(item: AIShoppingItem): Promise<any[]> {
  const supabase = await createServerClient();

  // Simple category-based search as fallback
  const { data: category } = await supabase
    .from('product_categories')
    .select('id')
    .ilike('name', `%${item.category}%`)
    .single();

  if (!category) return [];

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('category_id', category.id)
    .order('rating_average', { ascending: false })
    .limit(5);

  return products || [];
}

/**
 * Get AI shopping recommendations for event
 */
export async function getAIShoppingRecommendations(
  eventId: string
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select('event_type, theme, guest_count, ai_blueprint')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();

    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    // Get recommended products based on event type
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .contains('event_types', [event.event_type])
      .order('rating_average', { ascending: false })
      .limit(20);

    return { success: true, data: products || [] };
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return { success: false, error: 'Failed to get recommendations' };
  }
}
