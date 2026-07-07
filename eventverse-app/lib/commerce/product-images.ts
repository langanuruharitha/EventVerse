/**
 * Centralized product image resolver.
 *
 * This module provides smart image resolution for products:
 * 1. PRIMARY: Uses the database `primary_image_url` when available
 * 2. FALLBACK: Detects product type from name/category/tags and picks
 *    accurate, curated images when database URL is missing
 * 3. EVENT-AWARE: Provides event-appropriate images (e.g., elegant for
 *    wedding, colorful for birthday) as additional fallbacks
 *
 * It is pure TypeScript so it works in both server and client components.
 */

export type ProductLike = {
  name?: string;
  slug?: string;
  primary_image_url?: string;
  category_id?: string;
  tags?: string[];
  event_types?: string[];
  // category slug/name may be joined from the DB
  category?: { slug?: string; name?: string } | string;
};

export type OrderItemLike = {
  product_name?: string;
  product_sku?: string;
  product_image_url?: string;
};

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

export type ProductType =
  | 'balloon'
  | 'balloon-pump'
  | 'balloon-arch'
  | 'number-balloon'
  | 'heart-balloon'
  | 'foil-balloon'
  | 'banner'
  | 'cake-topper'
  | 'candle'
  | 'fairy-lights'
  | 'plate'
  | 'cup'
  | 'napkin'
  | 'cutlery'
  | 'straw'
  | 'tablecloth'
  | 'gift-bag'
  | 'favor'
  | 'backdrop'
  | 'photo-props'
  | 'pom-pom'
  | 'garland'
  | 'streamer'
  | 'succulent'
  | 'decoration'
  | 'tableware'
  | 'balloons'
  | 'generic';

/**
 * Curated, accurate Unsplash photo IDs per product type.
 * Multiple per type so different products in the same type get variety.
 */
const TYPE_IMAGES: Record<ProductType, string[]> = {
  balloon: [U('1530103862676-de8c9debad1d'), U('1489380556486-b3b8e7c6a7c9'), U('1530103862676-de8c9debad1d')],
  balloons: [U('1530103862676-de8c9debad1d'), U('1489380556486-b3b8e7c6a7c9'), U('1530103862676-de8c9debad1d')],
  'balloon-pump': [U('1606293459358-c9085f4b6b6a'), U('1583394838376-f1f6c9c19c45'), U('1530103862676-de8c9debad1d')],
  'balloon-arch': [U('1530103862676-de8c9debad1d'), U('1489380556486-b3b8e7c6a7c9'), U('1513151233558-d860c5398176')],
  'number-balloon': [U('1464349095431-e9a21285b5f3'), U('1513151233558-d860c5398176'), U('1464349095431-e9a21285b5f3')],
  'heart-balloon': [U('1518199266791-5375b9f4d6e4'), U('1513151233558-d860c5398176'), U('1518199266791-5375b9f4d6e4')],
  'foil-balloon': [U('1513151233558-d860c5398176'), U('1464349095431-e9a21285b5f3'), U('1530103862676-de8c9debad1d')],
  banner: [U('1558618666-fcd25c85cd64'), U('1530103862676-de8c9debad1d'), U('1558618666-fcd25c85cd64')],
  'cake-topper': [U('1558636508-e0db3814bd1d'), U('1519951505475-2b76b7e2a4d3'), U('1558636508-e0db3814bd1d')],
  candle: [U('1558636508-e0db3814bd1d'), U('1606293459358-c9085f4b6b6a'), U('1558636508-e0db3814bd1d')],
  'fairy-lights': [U('1513885535751-8b9238bd345a'), U('1606293459358-c9085f4b6b6a'), U('1513885535751-8b9238bd345a')],
  plate: [U('1608686207856-001b95cf60ca'), U('1602143407151-7111542de6e8'), U('1608686207856-001b95cf60ca')],
  cup: [U('1602143407151-7111542de6e8'), U('1519689680058-324335c77eba'), U('1602143407151-7111542de6e8')],
  napkin: [U('1519689680058-324335c77eba'), U('1608686207856-001b95cf60ca'), U('1519689680058-324335c77eba')],
  cutlery: [U('1602143407151-7111542de6e8'), U('1608686207856-001b95cf60ca'), U('1602143407151-7111542de6e8')],
  straw: [U('1519689680058-324335c77eba'), U('1608686207856-001b95cf60ca'), U('1519689680058-324335c77eba')],
  tablecloth: [U('1608686207856-001b95cf60ca'), U('1519689680058-324335c77eba'), U('1608686207856-001b95cf60ca')],
  'gift-bag': [U('1513885535751-8b9238bd345a'), U('1606293459358-c9085f4b6b6a'), U('1513885535751-8b9238bd345a')],
  favor: [U('1513885535751-8b9238bd345a'), U('1606293459358-c9085f4b6b6a'), U('1513885535751-8b9238bd345a')],
  backdrop: [U('1519167758481-83f29da8c9f4'), U('1511795409834-ef04bbd61722'), U('1519167758481-83f29da8c9f4')],
  'photo-props': [U('1511795409834-ef04bbd61722'), U('1519167758481-83f29da8c9f4'), U('1511795409834-ef04bbd61722')],
  'pom-pom': [U('1558618666-fcd25c85cd64'), U('1530103862676-de8c9debad1d'), U('1558618666-fcd25c85cd64')],
  garland: [U('1558618666-fcd25c85cd64'), U('1513151233558-d860c5398176'), U('1558618666-fcd25c85cd64')],
  streamer: [U('1530103862676-de8c9debad1d'), U('1558618666-fcd25c85cd64'), U('1513151233558-d860c5398176')],
  succulent: [U('1459156212016-c812468e2115'), U('1606293459358-c9085f4b6b6a'), U('1459156212016-c812468e2115')],
  decoration: [U('1558618666-fcd25c85cd64'), U('1530103862676-de8c9debad1d'), U('1513151233558-d860c5398176')],
  tableware: [U('1608686207856-001b95cf60ca'), U('1602143407151-7111542de6e8'), U('1519689680058-324335c77eba')],
  generic: [U('1530103862676-de8c9debad1d'), U('1558618666-fcd25c85cd64'), U('1513885535751-8b9238bd345a')],
};

/**
 * Event-specific overlay images. When a product belongs to an event type
 * listed here, we prefer the event-appropriate image to avoid
 * cross-contamination (e.g. elegant white/gold for wedding, pastel for
 * baby_shower, colorful for birthday).
 */
const EVENT_IMAGES: Record<string, string[]> = {
  birthday: [U('1530103862676-de8c9debad1d'), U('1558618666-fcd25c85cd64'), U('1513151233558-d860c5398176')],
  wedding: [U('1519741497674-611481863552'), U('1511285560929-80b456fea0bc'), U('1465495976277-4387d4b0b4c6')],
  baby_shower: [U('1515488764276-beab7607c1e6'), U('1519689680058-324335c77eba'), U('1515488764276-beab7607c1e6')],
  anniversary: [U('1518199266791-5375b9f4d6e4'), U('1511285560929-80b456fea0bc'), U('1519741497674-611481863552')],
  corporate: [U('1511578314322-379afb476865'), U('1505373877841-8d25f7d46678'), U('1511578314322-379afb476865')],
  engagement: [U('1511285560929-80b456fea0bc'), U('1465495976277-4387d4b0b4c6'), U('1519741497674-611481863552')],
};

/**
 * Keywords used to detect a product type from its name/tags.
 * Order matters: more specific keywords are checked first.
 */
const TYPE_KEYWORDS: { type: ProductType; keywords: string[] }[] = [
  { type: 'balloon-pump', keywords: ['pump', 'inflater', 'inflator'] },
  { type: 'balloon-arch', keywords: ['arch', 'garland kit', 'arch kit'] },
  { type: 'number-balloon', keywords: ['number balloon', 'number set', 'age number', 'giant number', 'xxl number'] },
  { type: 'heart-balloon', keywords: ['heart balloon', 'heart shaped', 'heart shape'] },
  { type: 'foil-balloon', keywords: ['foil', 'mylar'] },
  { type: 'cake-topper', keywords: ['cake topper', 'topper'] },
  { type: 'candle', keywords: ['candle', 'number candle'] },
  { type: 'fairy-lights', keywords: ['fairy light', 'string light', 'led light', 'fairy string'] },
  { type: 'photo-props', keywords: ['photo prop', 'photo booth', 'booth prop'] },
  { type: 'backdrop', keywords: ['backdrop', 'sequin wall', 'photo background'] },
  { type: 'gift-bag', keywords: ['gift bag', 'goodie bag', 'favor box', 'gift box', 'thank you bag'] },
  { type: 'favor', keywords: ['favor', 'favour', 'return gift', 'keepsake'] },
  { type: 'pom-pom', keywords: ['pom pom', 'pompom', 'tissue paper pom'] },
  { type: 'garland', keywords: ['garland', 'onesie garland'] },
  { type: 'streamer', keywords: ['streamer', 'swirl', 'hanging swirl', 'door curtain', 'fringe'] },
  { type: 'banner', keywords: ['banner', 'sign', 'happy birthday sign', 'bunting'] },
  { type: 'plate', keywords: ['plate', 'dessert plate', 'charger plate'] },
  { type: 'cup', keywords: ['cup', 'mug', 'glass', 'flute', 'wine glass', 'juice cup'] },
  { type: 'napkin', keywords: ['napkin', 'paper napkin'] },
  { type: 'straw', keywords: ['straw'] },
  { type: 'cutlery', keywords: ['cutlery', 'fork', 'spoon', 'knife', 'silverware', 'flatware'] },
  { type: 'tablecloth', keywords: ['table cloth', 'tablecloth', 'table runner', 'runner'] },
  { type: 'succulent', keywords: ['succulent', 'plant favor'] },
  { type: 'balloon', keywords: ['balloon', 'balloons'] },
  { type: 'decoration', keywords: ['decor', 'decoration', 'party hat', 'crown', 'confetti', 'sticker', 'decal'] },
];

const TYPE_EMOJI: Record<ProductType, string> = {
  balloon: '🎈',
  balloons: '🎈',
  'balloon-pump': '🎈',
  'balloon-arch': '🎈',
  'number-balloon': '🔢',
  'heart-balloon': '❤️',
  'foil-balloon': '✨',
  banner: '🎏',
  'cake-topper': '🎂',
  candle: '🕯️',
  'fairy-lights': '✨',
  plate: '🍽️',
  cup: '🥤',
  napkin: '🧻',
  cutlery: '🍴',
  straw: '🥤',
  tablecloth: '🍽️',
  'gift-bag': '🎁',
  favor: '🎁',
  backdrop: '🖼️',
  'photo-props': '📸',
  'pom-pom': '🌸',
  garland: '🌺',
  streamer: '🎊',
  succulent: '🪴',
  decoration: '🎨',
  tableware: '🍽️',
  generic: '🎉',
};

const TYPE_COLORS: Record<ProductType, [string, string]> = {
  balloon: ['#f472b6', '#a855f7'],
  balloons: ['#f472b6', '#a855f7'],
  'balloon-pump': ['#f472b6', '#ec4899'],
  'balloon-arch': ['#f9a8d4', '#a855f7'],
  'number-balloon': ['#fbbf24', '#f59e0b'],
  'heart-balloon': ['#fb7185', '#e11d48'],
  'foil-balloon': ['#fde68a', '#f59e0b'],
  banner: ['#c4b5fd', '#7c3aed'],
  'cake-topper': ['#fdba74', '#f97316'],
  candle: ['#fcd34d', '#f59e0b'],
  'fairy-lights': ['#a5b4fc', '#6366f1'],
  plate: ['#93c5fd', '#3b82f6'],
  cup: ['#7dd3fc', '#0ea5e9'],
  napkin: ['#bae6fd', '#0284c7'],
  cutlery: ['#cbd5e1', '#64748b'],
  straw: ['#7dd3fc', '#06b6d4'],
  tablecloth: ['#a7f3d0', '#10b981'],
  'gift-bag': ['#f9a8d4', '#db2777'],
  favor: ['#fbcfe8', '#db2777'],
  backdrop: ['#ddd6fe', '#8b5cf6'],
  'photo-props': ['#fef08a', '#eab308'],
  'pom-pom': ['#f9a8d4', '#ec4899'],
  garland: ['#fda4af', '#e11d48'],
  streamer: ['#fca5a5', '#ef4444'],
  succulent: ['#86efac', '#16a34a'],
  decoration: ['#d8b4fe', '#9333ea'],
  tableware: ['#bfdbfe', '#2563eb'],
  generic: ['#e9d5ff', '#a855f7'],
};

/** Deterministic hash so the same product always picks the same image. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string, offset = 0): T {
  if (!arr || arr.length === 0) return undefined as unknown as T;
  return arr[(hashStr(seed) + offset) % arr.length];
}

function categorySlug(product: ProductLike): string {
  const c = product.category;
  if (!c) return '';
  if (typeof c === 'string') return c.toLowerCase();
  return (c.slug || c.name || '').toLowerCase();
}

/**
 * Detect the product type from name + category + tags.
 * Specific keywords (pump, arch, number, heart, foil) are checked before
 * the generic "balloon" keyword so a "balloon pump" is not classified as a
 * plain balloon.
 */
export function getProductType(product: ProductLike): ProductType {
  const name = (product.name || '').toLowerCase();
  const cat = categorySlug(product);
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const haystack = `${name} ${cat} ${tags.join(' ')}`;

  // Category-level fallbacks
  if (cat.includes('balloon')) {
    // still run keyword checks for sub-types
  } else if (cat.includes('tableware') || cat.includes('plate') || cat.includes('cup')) {
    if (!TYPE_KEYWORDS.some((k) => k.keywords.some((kw) => haystack.includes(kw)))) {
      return 'tableware';
    }
  } else if (cat.includes('decor')) {
    if (!TYPE_KEYWORDS.some((k) => k.keywords.some((kw) => haystack.includes(kw)))) {
      return 'decoration';
    }
  } else if (cat.includes('light')) {
    if (!haystack.includes('fairy') && !haystack.includes('string') && !haystack.includes('led')) {
      return 'fairy-lights';
    }
  } else if (cat.includes('banner') || cat.includes('sign')) {
    if (!haystack.includes('cake') && !haystack.includes('candle')) return 'banner';
  } else if (cat.includes('prop') || cat.includes('backdrop')) {
    if (haystack.includes('backdrop')) return 'backdrop';
    return 'photo-props';
  } else if (cat.includes('cake')) {
    if (haystack.includes('topper')) return 'cake-topper';
    if (haystack.includes('candle')) return 'candle';
    return 'cake-topper';
  } else if (cat.includes('favor') || cat.includes('gift')) {
    if (!TYPE_KEYWORDS.some((k) => k.keywords.some((kw) => haystack.includes(kw)))) {
      return 'favor';
    }
  }

  for (const { type, keywords } of TYPE_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) {
      return type;
    }
  }

  return 'generic';
}

/** First event type from a product (used to choose event-appropriate images). */
export function getEventType(product: ProductLike): string | undefined {
  const arr = product.event_types;
  if (Array.isArray(arr) && arr.length > 0) return arr[0];
  return undefined;
}

/**
 * Pick the best image URL for a product. If an event type is provided (or
 * derivable from the product), the image is event-appropriate so wedding
 * pages never show baby images, etc.
 * 
 * UPDATED: Now respects the database primary_image_url when available,
 * only falling back to type-based detection for missing/empty URLs.
 */
export function resolveProductImage(
  product: ProductLike,
  eventType?: string
): string {
  // First priority: Use the database primary_image_url if available
  if (product.primary_image_url && product.primary_image_url.trim() !== '') {
    return product.primary_image_url;
  }

  // Second priority: Generate a PERFECT product image instantly using Pollinations AI
  // based exactly on the product's name
  if (product.name) {
    const prompt = `${product.name}, high quality product photography, white background, cinematic lighting`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=600&nologo=true`;
  }

  // Fallback to type-based detection (for products without specific images or names)
  const type = getProductType(product);
  const event = eventType || getEventType(product);
  const seed = product.name || product.slug || type;

  // Prefer an event-appropriate image to avoid cross-event contamination.
  if (event && EVENT_IMAGES[event]) {
    return pick(EVENT_IMAGES[event], seed);
  }
  return pick(TYPE_IMAGES[type] || TYPE_IMAGES.generic, seed);
}

/**
 * Build gallery URLs from the same product photo (different crops/zoom).
 */
function buildSameImageVariants(url: string, count = 4): string[] {
  if (!url.includes('unsplash.com')) {
    return Array.from({ length: count }, () => url);
  }

  const [base, query = ''] = url.split('?');
  const params = new URLSearchParams(query);
  params.set('auto', 'format');

  const crops = ['center', 'top', 'bottom', 'entropy'];
  return crops.slice(0, count).map((crop) => {
    const next = new URLSearchParams(params);
    next.set('w', '800');
    next.set('h', '800');
    next.set('fit', 'crop');
    next.set('crop', crop);
    return `${base}?${next.toString()}`;
  });
}

/**
 * Return gallery image URLs for the product detail page.
 * Uses database images when available; otherwise repeats the primary image
 * with different crops so thumbnails match the main product.
 */
export function resolveProductGallery(
  product: ProductLike & { images?: string[] },
  eventType?: string
): string[] {
  const primary = product.primary_image_url?.trim();
  const dbImages = (product.images || []).filter((img) => img && img.trim());

  if (dbImages.length > 0) {
    const gallery = primary ? [primary, ...dbImages] : dbImages;
    return Array.from(new Set(gallery)).slice(0, 4);
  }

  if (primary) {
    return buildSameImageVariants(primary, 4);
  }

  return [resolveProductImage(product, eventType)];
}

/** Resolve an image for a historical order item (snapshot data). */
export function resolveOrderItemImage(item: OrderItemLike): string {
  return resolveProductImage(
    { name: item.product_name, slug: item.product_sku },
    undefined
  );
}

export function categoryEmoji(type: ProductType | ProductLike): string {
  const t = typeof type === 'string' ? type : getProductType(type);
  return TYPE_EMOJI[t] || '🎉';
}

/**
 * Build an inline SVG data-URI placeholder (gradient + emoji) used as the
 * final fallback so an image NEVER renders blank or as a broken-image icon.
 */
export function placeholderSvg(product: ProductLike): string {
  const type = getProductType(product);
  const [c1, c2] = TYPE_COLORS[type] || TYPE_COLORS.generic;
  const emoji = categoryEmoji(type);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='600' height='600' fill='url(#g)'/>
    <text x='50%' y='50%' font-size='180' text-anchor='middle' dominant-baseline='central'>${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Build a fallback list for a product: [primary, secondary, ..., placeholder].
 * Used by the ProductImage component's onError chain.
 * 
 * UPDATED: Ensures database primary_image_url is first in fallback chain.
 */
export function getProductImageFallbacks(
  product: ProductLike,
  eventType?: string
): string[] {
  const type = getProductType(product);
  const event = eventType || getEventType(product);
  const seed = product.name || product.slug || type;
  const typeImgs = TYPE_IMAGES[type] || TYPE_IMAGES.generic;
  const list: string[] = [];
  
  // First priority: database primary_image_url (via resolveProductImage)
  list.push(resolveProductImage(product, eventType));
  
  // Additional fallbacks
  if (event && EVENT_IMAGES[event]) list.push(pick(EVENT_IMAGES[event], seed, 1));
  list.push(pick(typeImgs, seed, 1));
  list.push(pick(typeImgs, seed, 2));
  list.push(placeholderSvg(product));
  
  return Array.from(new Set(list));
}
