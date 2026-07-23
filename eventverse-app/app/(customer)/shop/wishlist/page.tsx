'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import ProductImage from '@/components/shop/ProductImage';
import { useToast } from '@/components/ui/Toast';

interface WishlistItem {
  id: string;
  added_at: string;
  products: any;
}

export default function WishlistPage() {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
      setItems(items.filter(item => item.products.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const moveToCart = async (item: WishlistItem) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.products.id, quantity: 1 }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        window.dispatchEvent(new Event('cart-updated'));
        await removeFromWishlist(item.products.id);
        toast('Added to cart!', 'success');
      } else {
        toast(result.error || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3">❤️</div>
          <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <button
              onClick={() => router.push('/shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#8A1C2C]" />
              <h1 className="text-2xl font-bold text-[#2C1810]">My Wishlist</h1>
              <span className="text-xs text-[#1F1E1B]/50 font-sans">({items.length} items)</span>
            </div>
            <p className="text-xs text-[#1F1E1B]/50 italic mt-1 font-sans">
              Your curated collection of desired items
            </p>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white border border-dashed border-[#DDD0BB] rounded shadow-sm p-16 text-center">
            <Heart className="w-12 h-12 text-[#DDD0BB] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#2C1810] mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#1F1E1B]/50 italic mb-6 font-sans">
              Save items you love to revisit and purchase later
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow-lg transition font-sans"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden hover:shadow-md hover:border-[#8A1C2C]/30 transition-all group"
              >
                {/* Product Image */}
                <div
                  className="aspect-square bg-[#EDE0CC] cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/shop/product/${item.products.slug}`)}
                >
                  <ProductImage
                    src={item.products.primary_image_url}
                    alt={item.products.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-semibold text-sm text-[#1F1E1B] mb-0.5 line-clamp-2 cursor-pointer hover:text-[#8A1C2C] transition-colors"
                    onClick={() => router.push(`/shop/product/${item.products.slug}`)}
                  >
                    {item.products.name}
                  </h3>
                  <p className="text-[10px] text-[#1F1E1B]/40 font-sans italic mb-3">
                    Added {new Date(item.added_at).toLocaleDateString('en-IN')}
                  </p>
                  <div className="text-base font-bold text-[#8A1C2C] font-sans mb-4">
                    ₹{item.products.price?.toLocaleString('en-IN')}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-[10px] font-bold rounded hover:shadow transition font-sans"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.products.id)}
                      className="p-2 border border-[#DDD0BB] text-red-400 hover:text-red-600 hover:border-red-300 rounded transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
