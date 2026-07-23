'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
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
    params.then((resolvedParams) => {
      setCategorySlug(resolvedParams.category);
    });
  }, [params]);

  useEffect(() => {
    if (categorySlug) fetchCategoryAndProducts();
  }, [categorySlug, sortBy]);

  const fetchCategoryAndProducts = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories').select('*').eq('slug', categorySlug).single();
      if (categoryError) throw categoryError;
      setCategory(categoryData);

      let query = supabase.from('products').select('*')
        .eq('category_id', categoryData.id).eq('status', 'active');

      switch (sortBy) {
        case 'price-low':  query = query.order('price', { ascending: true }); break;
        case 'price-high': query = query.order('price', { ascending: false }); break;
        case 'rating':     query = query.order('rating_average', { ascending: false }); break;
        default:           query = query.order('sales_count', { ascending: false }); break;
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
      <div className="min-h-screen bg-[#FAF6F0] p-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-6 bg-[#EDE0CC] rounded w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-[#EDE0CC] rounded border border-[#DDD0BB]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="text-xl font-bold text-[#2C1810] mb-4">Category Not Found</h1>
          <button
            onClick={() => router.push('/shop')}
            className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow transition font-sans"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </button>
          <h1 className="text-2xl font-bold text-[#2C1810]">{category.name}</h1>
          {category.description && (
            <p className="text-xs text-[#1F1E1B]/60 italic mt-1 font-sans">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <p className="text-xs text-[#1F1E1B]/50 font-sans">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
          <div className="flex gap-2 items-center">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-[#DDD0BB] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#8A1C2C] bg-[#FAF6F0] font-sans text-[#1F1E1B]/70"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden hover:shadow-md hover:border-[#8A1C2C]/30 transition-all cursor-pointer group"
                onClick={() => router.push(`/shop/product/${product.slug}`)}
              >
                {/* Image */}
                <div className="aspect-square bg-[#EDE0CC] relative overflow-hidden">
                  <ProductImage product={product} alt={product.name} />
                  {(product.discount_percentage ?? 0) > 0 && (
                    <span className="absolute top-2 right-2 bg-[#8A1C2C] text-[#FAF0E0] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
                      {Math.round(product.discount_percentage ?? 0)}% OFF
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-[#1F1E1B] mb-1 line-clamp-2 group-hover:text-[#8A1C2C] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-[#1F1E1B]/50 italic mb-2 line-clamp-2 font-sans">
                    {product.short_description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-semibold font-sans">{product.rating_average.toFixed(1)}</span>
                    <span className="text-[9px] text-[#1F1E1B]/40 font-sans">({product.review_count})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-base font-bold text-[#8A1C2C] font-sans">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-[10px] text-[#1F1E1B]/40 line-through font-sans">
                        ₹{product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  {product.stock_quantity === 0 ? (
                    <span className="block w-full text-center py-1 text-[9px] font-bold text-red-700 bg-red-500/10 border border-red-500/20 rounded uppercase tracking-wider font-sans mb-2">
                      Out of Stock
                    </span>
                  ) : product.stock_quantity < 10 ? (
                    <p className="text-[10px] text-orange-600 mb-2 font-sans italic">
                      Only {product.stock_quantity} left!
                    </p>
                  ) : null}

                  {/* Actions */}
                  {product.stock_quantity > 0 && (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-1.5 border border-[#DDD0BB] text-[#7A6652] text-[10px] font-semibold rounded hover:bg-[#FAF6F0] font-sans transition"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        Buy Now
                      </button>
                      <button
                        className="flex-1 py-1.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-[10px] font-bold rounded flex items-center justify-center gap-1 hover:shadow font-sans transition"
                        onClick={(e) => { e.stopPropagation(); router.push(`/shop/product/${product.slug}`); }}
                      >
                        <ShoppingCart className="w-3 h-3" /> View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#DDD0BB] rounded p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-sm text-[#1F1E1B]/50 italic mb-6">No products found in this category.</p>
            <button
              onClick={() => router.push('/shop')}
              className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow transition font-sans"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
