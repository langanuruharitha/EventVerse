'use client';

import { useEffect, useState } from 'react';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [categorySlug, setCategorySlug] = useState<string>('');

  useEffect(() => {
    // Unwrap params Promise
    params.then((resolvedParams) => {
      setCategorySlug(resolvedParams.category);
    });
  }, [params]);

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [categorySlug, sortBy]);

  const fetchCategoryAndProducts = async () => {
    try {
      const supabase = createBrowserClient();

      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();

      if (categoryError) throw categoryError;

      setCategory(categoryData);

      // Fetch products in this category
      let query = supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('status', 'active');

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating_average', { ascending: false });
          break;
        case 'popular':
        default:
          query = query.order('sales_count', { ascending: false });
          break;
      }

      const { data: productsData, error: productsError } = await query;

      if (productsError) throw productsError;

      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching category and products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Button onClick={() => router.push('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>

          <div className="flex gap-3 items-center">
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="popular">Most Popular</option>
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
                className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/shop/product/${product.slug}`)}
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  <ProductImage
                    product={product}
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
                    <span className="text-2xl font-bold text-purple-600">
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
            <p className="text-gray-600 text-lg">No products found in this category.</p>
            <Button onClick={() => router.push('/shop')} className="mt-4">
              Browse All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
