'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft } from 'lucide-react';
import ProductImage from '@/components/shop/ProductImage';
import { resolveProductGallery } from '@/lib/commerce/product-images';
import ProductReviews from '@/components/shop/ProductReviews';

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  stock_quantity: number;
  primary_image_url: string;
  images: string[];
  rating_average: number;
  review_count: number;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  event_types?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState({ color: '', size: '' });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const slug = resolvedParams.slug;

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      checkWishlistStatus();
    }
  }, [product]);

  const checkWishlistStatus = async () => {
    if (!product) return;
    
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      const inWishlist = data.items?.some((item: any) => item.products.id === product.id);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await fetch(`/api/wishlist?productId=${product.id}`, {
          method: 'DELETE'
        });
        setIsInWishlist(false);
        alert('Removed from wishlist');
      } else {
        // Add to wishlist
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
        setIsInWishlist(true);
        alert('Added to wishlist! ❤️');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Please sign in to use wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchProduct = async () => {
    
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) throw error;

      setProduct(data);
      const gallery = resolveProductGallery(data);
      setSelectedImage(gallery[0] || data.primary_image_url || '');
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        window.dispatchEvent(new Event('cart-updated'));
        router.refresh();
        alert('Product added to cart!');
      } else if (response.status === 401 || result.error === 'Not authenticated') {
        router.push('/auth/signin');
      } else {
        alert(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading || !slug) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const discount = product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const allImages = resolveProductGallery(product);

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-white border">
              <ProductImage
                product={product}
                src={selectedImage}
                contain
                alt={product.name}
              />
            </div>

            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === img ? 'border-[#8A1C2C]' : 'border-[#DDD0BB]'
                    }`}
                  >
                    <ProductImage
                      product={product}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand & Name */}
            {product.brand && (
              <p className="text-sm text-gray-600">{product.brand}</p>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating_average)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating_average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 font-sans">
                <span className="text-4xl font-bold text-[#8A1C2C]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-xl text-[#1F1E1B]/40 line-through">
                      ₹{product.original_price.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 bg-[#8A1C2C] text-[#FAF0E0] text-[10px] font-bold rounded uppercase tracking-wider">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <p className="text-gray-700">{product.short_description}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedVariant.color === color
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedVariant.size === size
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </Button>
                <span className="text-sm text-gray-500 ml-2">
                  {product.stock_quantity} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 font-sans">
              <button
                disabled={addingToCart || product.stock_quantity === 0}
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleAddToCart();
                  router.push('/shop/cart/checkout');
                }}
                className="w-full py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow-lg transition disabled:opacity-50"
              >
                Buy Now
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock_quantity === 0}
                  className="flex-1 py-3 border border-[#DDD0BB] bg-white text-[#7A6652] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#FAF6F0] transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={isInWishlist ? 'border-pink-500 bg-pink-50' : ''}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : ''}`} 
                  />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            {product.stock_quantity === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Out of Stock</p>
              </div>
            )}

            {/* Estimated Delivery Date */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Estimated Delivery</p>
                  <p className="text-green-700 font-bold text-base">
                    {(() => {
                      const today = new Date();
                      const min = new Date(today); min.setDate(today.getDate() + 4);
                      const max = new Date(today); max.setDate(today.getDate() + 7);
                      const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                      return `${fmt(min)} – ${fmt(max)}`;
                    })()}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">Order now for fastest delivery</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-gray-400" />
                <span>Free delivery on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-gray-400" />
                <span>7 days return & exchange policy</span>
              </div>
            </div>

            {/* Event Types */}
            {product.event_types && product.event_types.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-2">Perfect for</h3>
                <div className="flex flex-wrap gap-2">
                  {product.event_types.map((type) => (
                    <Badge key={type} variant="info">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tab */}
        {product.long_description && (
          <div className="mt-12">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Product Details</h2>
              <div className="prose max-w-none text-gray-700">
                {product.long_description}
              </div>
            </Card>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
