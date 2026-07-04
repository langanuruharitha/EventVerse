'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import ProductImage from '@/components/shop/ProductImage';

interface WishlistItem {
  id: string;
  added_at: string;
  products: any;
}

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

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
      await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      });
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
        alert('Added to cart!');
      } else {
        alert(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/shop')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-pink-600" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <span className="text-gray-500">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">
              Save items you love to buy them later
            </p>
            <Button onClick={() => router.push('/shop')}>
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <ProductImage
                    src={item.products.primary_image_url}
                    alt={item.products.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{item.products.name}</h3>
                  <p className="text-xl font-bold text-purple-600 mb-4">
                    ₹{item.products.price}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => moveToCart(item)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => removeFromWishlist(item.products.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
