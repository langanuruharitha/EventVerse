'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Star, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import ProductImage from '@/components/shop/ProductImage';

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  primary_image_url: string;
  rating_average: number;
  review_count: number;
  stock_quantity: number;
}

const eventTypeInfo: Record<string, { title: string; icon: string; description: string }> = {
  birthday: {
    title: 'Birthday Party Products',
    icon: '🎂',
    description: 'Everything you need for an amazing birthday celebration!'
  },
  wedding: {
    title: 'Wedding Products',
    icon: '💍',
    description: 'Beautiful products for your special day'
  },
  anniversary: {
    title: 'Anniversary Products',
    icon: '💐',
    description: 'Celebrate love with our curated collection'
  },
  baby_shower: {
    title: 'Baby Shower Products',
    icon: '👶',
    description: 'Welcome the little one with adorable items'
  },
  corporate: {
    title: 'Corporate Event Products',
    icon: '🏢',
    description: 'Professional items for business events'
  }
};

export default function EventTypePage({ params }: { params: Promise<{ eventType: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');
  const eventType = resolvedParams.eventType;

  const eventInfo = eventTypeInfo[eventType] || {
    title: 'Event Products',
    icon: '🎉',
    description: 'Products for your event'
  };

  useEffect(() => {
    if (eventType) {
      fetchProducts();
    }
  }, [eventType, sortBy]);

  const fetchProducts = async () => {
    try {
      const supabase = createBrowserClient();

      console.log('========= PRODUCT FETCH DEBUG =========');
      console.log('Event type from URL:', eventType);
      console.log('Event type type:', typeof eventType);

      // Try using the @> operator directly for array containment
      // This checks if event_types array contains the eventType
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .filter('event_types', 'cs', `{${eventType}}`);

      // Apply sorting
      switch (sortBy) {
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating_average', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched products count:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('First product:', {
          name: data[0].name,
          event_types: data[0].event_types,
          status: data[0].status
        });
      } else {
        console.log('No products returned - checking all products:');
        // Try fetching without filter to see if products exist
        const { data: allProducts } = await supabase
          .from('products')
          .select('event_types, status')
          .limit(5);
        console.log('Sample products from DB:', allProducts);
      }
      console.log('======================================');

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !eventType) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
        {/* Header */}
        <div className="bg-[#2C1810] text-[#FAF0E0] py-10 border-b border-[#C5A880]/30 relative">
          <div className="max-w-7xl mx-auto px-4">
            <button
              onClick={() => router.push('/shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider font-sans mb-4 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
            </button>
            <div className="text-center">
              <div className="text-6xl mb-4">{eventInfo.icon}</div>
              <h1 className="text-4xl font-bold mb-2">{eventInfo.title}</h1>
              <p className="text-xl text-purple-100">{eventInfo.description}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 font-medium">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>

            <div className="flex gap-3 items-center">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => router.push(`/shop/product/${product.slug}`)}
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    <ProductImage
                      product={product}
                      eventType={eventType}
                      alt={product.name}
                    />
                    {(product.discount_percentage ?? 0) > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        {Math.round(product.discount_percentage ?? 0)}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.short_description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating_average.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({product.review_count})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-[#8A1C2C] font-sans">
                        ₹{product.price.toFixed(2)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock_quantity === 0 ? (
                      <Badge variant="danger" className="w-full justify-center">
                        Out of Stock
                      </Badge>
                    ) : product.stock_quantity < 10 ? (
                      <p className="text-sm text-orange-600 mb-2">
                        Only {product.stock_quantity} left!
                      </p>
                    ) : null}

                    {/* Action Buttons */}
                    {product.stock_quantity > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Buy Now - placeholder (not functional yet)
                          }}
                        >
                          Buy Now
                        </Button>
                        <Button
                          className="flex-1 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/shop/product/${product.slug}`);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found for this event type.</p>
              <Button onClick={() => router.push('/shop')} className="mt-4">
                Browse All Products
              </Button>
            </div>
          )}
        </div>
    </div>
  );
}
