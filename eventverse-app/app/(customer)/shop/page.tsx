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
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section Ornate Frame */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 sm:p-10 shadow-md">
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="text-center relative space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/30 bg-[#FAF6F0] text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans">
              ⚜ Heritage Store
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1810]">
              EventVerse Shop
            </h1>
            <p className="text-sm sm:text-base text-[#1F1E1B]/70 italic max-w-xl mx-auto">
              "Curated event collections, luxury gifts, traditional decors, and party accessories."
            </p>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A880]" />
              <span className="text-xs text-[#C5A880]">❦</span>
              <div className="h-px w-16 bg-gradient-to-r from-[#C5A880] to-transparent" />
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-6">
              <div className="flex border border-[#DDD0BB] rounded bg-[#FFFDF8] overflow-hidden">
                <input
                  type="text"
                  placeholder="Search decorations, party supplies, and premium gifts..."
                  className="w-full px-5 py-3 text-sm focus:outline-none text-[#2C1810] placeholder-[#9B8B7A]"
                  style={{ background: 'transparent' }}
                />
                <button
                  className="px-6 text-xs font-semibold uppercase tracking-widest text-[#FAF0E0] transition-colors"
                  style={{ background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)' }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
            <span className="text-[#C5A880]">❦</span> Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/shop/${category.slug}`}
                className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-6 hover:shadow-md transition-all text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon_name || '🎉'}
                </div>
                <h3 className="font-bold text-[#1F1E1B] text-sm group-hover:text-[#8A1C2C] transition-colors">{category.name}</h3>
                <p className="text-[11px] text-[#1F1E1B]/60 italic mt-1.5 leading-relaxed">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Event Quick Links */}
        <section className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { slug: 'birthday', name: 'Birthday Store', icon: '🎂', bg: 'bg-[#FFFDF8] border-[#DDD0BB]' },
              { slug: 'wedding', name: 'Wedding Store', icon: '💍', bg: 'bg-[#FFFDF8] border-[#DDD0BB]' },
              { slug: 'anniversary', name: 'Anniversary Store', icon: '💐', bg: 'bg-[#FFFDF8] border-[#DDD0BB]' },
              { slug: 'corporate', name: 'Corporate Store', icon: '🏢', bg: 'bg-[#FFFDF8] border-[#DDD0BB]' }
            ].map((link, i) => (
              <Link
                key={i}
                href={`/shop/event/${link.slug}`}
                className={`rounded border p-6 text-center hover:shadow-md transition-all hover:border-[#8A1C2C] ${link.bg}`}
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <div className="font-bold text-[#1F1E1B] text-sm">{link.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2">
              <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
                <span className="text-[#C5A880]">❦</span> Featured Products
              </h2>
              <Link
                href="/shop/featured"
                className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.slug}`}
                  className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden h-48 bg-[#FAF6F0]">
                      <ProductImage
                        product={product}
                        alt={product.name}
                        className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover"
                      />
                      {product.discount_percentage > 0 && (
                        <div className="absolute top-2 right-2 bg-[#8A1C2C] text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          {product.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-[#1F1E1B] text-sm line-clamp-2 leading-relaxed">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#8A1C2C]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-xs text-[#1F1E1B]/40 line-through">
                            ₹{product.original_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-sans">
                      <span>⭐</span>
                      <span className="font-bold text-[#1F1E1B]/70">
                        {product.rating_average.toFixed(1)} ({product.review_count})
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-700 italic border-t border-[#FAF6F0] pt-2">📅 Delivery in 4–7 days</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bestsellers */}
        {bestsellers && bestsellers.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2">
              <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
                <span className="text-[#C5A880]">❦</span> Bestsellers
              </h2>
              <Link
                href="/shop/bestsellers"
                className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestsellers.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.slug}`}
                  className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden h-48 bg-[#FAF6F0]">
                      <ProductImage
                        product={product}
                        alt={product.name}
                        className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-[#9B7A4A] text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        🔥 Bestseller
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-[#1F1E1B] text-sm line-clamp-2 leading-relaxed">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#8A1C2C]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#1F1E1B]/50 font-sans">
                      <span className="text-[#C5A880]">⭐ {product.rating_average.toFixed(1)}</span>
                      <span>{product.sales_count} sold</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 italic border-t border-[#FAF6F0] pt-2">📅 Delivery in 4–7 days</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Free Shipping', desc: 'On orders above ₹999', icon: '🚚' },
              { label: 'Quality Assured', desc: '100% authentic items', icon: '💯' },
              { label: 'Easy Returns', desc: '7 days return register', icon: '↩️' },
              { label: 'Gift Wrapping', desc: 'Available on request', icon: '🎁' }
            ].map((ben, i) => (
              <div key={i} className="bg-white rounded border border-[#DDD0BB] p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">{ben.icon}</div>
                <h3 className="font-bold text-[#1F1E1B] text-sm mb-1">{ben.label}</h3>
                <p className="text-xs text-[#1F1E1B]/60 italic">{ben.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
