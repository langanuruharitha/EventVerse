import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import ProductImage from '@/components/shop/ProductImage';

export default async function ShopPage() {
  const supabase = await createServerClient();

  // Fetch featured categories
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .is('parent_id', null)
    .order('display_order')
    .limit(8);

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('is_featured', true)
    .limit(8);

  // Fetch bestsellers
  const { data: bestsellers } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('is_bestseller', true)
    .order('sales_count', { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🛒 EventVerse Shop</h1>
          <p className="text-2xl mb-8 text-purple-100">
            Everything you need for your perfect event!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for decorations, gifts, party supplies..."
                className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
              <button className="absolute right-2 top-2 px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Category Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/shop/${category.slug}`}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-center"
              >
                <div className="text-5xl mb-3">
                  {category.icon_name || '🎉'}
                </div>
                <h3 className="font-bold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/shop/event/birthday"
              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2">🎂</div>
              <div className="font-semibold text-gray-800">Birthday</div>
            </Link>
            <Link
              href="/shop/event/wedding"
              className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2">💍</div>
              <div className="font-semibold text-gray-800">Wedding</div>
            </Link>
            <Link
              href="/shop/event/anniversary"
              className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2">💐</div>
              <div className="font-semibold text-gray-800">Anniversary</div>
            </Link>
            <Link
              href="/shop/event/corporate"
              className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2">🏢</div>
              <div className="font-semibold text-gray-800">Corporate</div>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <Link
                href="/shop/featured"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="relative overflow-hidden rounded-t-xl h-48">
                    <ProductImage
                      product={product}
                      alt={product.name}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount_percentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.discount_percentage}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.original_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600">
                        {product.rating_average.toFixed(1)} ({product.review_count})
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-2">📅 Delivery in 4–7 days</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bestsellers */}
        {bestsellers && bestsellers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">🔥 Bestsellers</h2>
              <Link
                href="/shop/bestsellers"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestsellers.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="relative overflow-hidden rounded-t-xl h-48">
                    <ProductImage
                      product={product}
                      alt={product.name}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🔥 Bestseller
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600">
                        {product.rating_average.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {product.sales_count} sold
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-2">📅 Delivery in 4–7 days</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders above ₹999</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-sm text-gray-600">100% authentic products</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">↩️</div>
              <h3 className="font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">7 days return policy</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold text-gray-900 mb-2">Gift Wrapping</h3>
              <p className="text-sm text-gray-600">Free on request</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
