'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Heart, Package, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { getCartItemCount } from '@/lib/commerce/cart-service';

export default function Navigation({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadCartCount();
    loadWishlistCount();

    const handleCartUpdated = () => {
      loadCartCount();
    };

    window.addEventListener('cart-updated', handleCartUpdated);
    return () => window.removeEventListener('cart-updated', handleCartUpdated);
  }, [pathname]);

  const checkUser = async () => {
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadCartCount = async () => {
    try {
      const result = await getCartItemCount();
      if (result.success) {
        setCartCount(result.count || 0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const loadWishlistCount = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      if (data.success) {
        setWishlistCount(data.items?.length || 0);
      }
    } catch (error) {
      console.error('Error loading wishlist count:', error);
    }
  };

  return (
    <nav className="bg-[#070913]/60 border-b border-white/5 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <button
                type="button"
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Cart, Wishlist, Orders & Profile */}
          <div className="flex items-center gap-2">
            {/* Wishlist Icon */}
            <Link
              href="/shop/wishlist"
              className="relative p-2 text-slate-400 hover:text-pink-400 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pink-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Orders Icon */}
            <Link
              href="/shop/orders"
              className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors"
              title="My Orders"
            >
              <Package className="w-5 h-5" />
            </Link>

            {/* Cart Icon */}
            <Link
              href="/shop/cart"
              className="relative p-2 text-slate-400 hover:text-purple-400 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile/Customer Icon */}
            <Link
              href={user ? "/dashboard/profile" : "/auth/signin"}
              className="relative p-2 text-slate-400 hover:text-purple-400 transition-colors border-l border-white/10 pl-4 ml-2"
              title={user ? "My Profile" : "Sign In"}
            >
              {user ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
