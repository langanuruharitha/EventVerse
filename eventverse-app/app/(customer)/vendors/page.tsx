import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

const vendorCategories = [
  { id: 'photography', name: 'Photography & Videography', icon: '📸', description: 'Professional event photography' },
  { id: 'decoration', name: 'Decoration & Design', icon: '🎨', description: 'Beautiful event decoration' },
  { id: 'catering', name: 'Catering & Food', icon: '🍽️', description: 'Delicious catering services' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎭', description: 'Live entertainment & DJ' },
  { id: 'mehendi', name: 'Mehendi Artists', icon: '✋', description: 'Traditional mehendi designs' },
  { id: 'cake', name: 'Cake & Bakery', icon: '🎂', description: 'Custom cakes & desserts' },
  { id: 'makeup', name: 'Makeup Artists', icon: '💄', description: 'Professional makeup services' },
  { id: 'planning', name: 'Event Planners', icon: '📋', description: 'Full event planning services' },
];

export default async function VendorsPage() {
  const supabase = await createServerClient();

  // Fetch top vendors
  const { data: vendors } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('is_approved', true)
    .order('rating', { ascending: false })
    .limit(12);

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
              ⚜ Heritage Guilds
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1810]">
              Vendor Marketplace
            </h1>
            <p className="text-sm sm:text-base text-[#1F1E1B]/70 italic max-w-xl mx-auto">
              "Enlist premier photographers, culinary masters, decorators and planners for your royal celebrations."
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
                  placeholder="Search photographers, caterers, planners and decorators..."
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
            <span className="text-[#C5A880]">❦</span> Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {vendorCategories.map((category) => (
              <Link
                key={category.id}
                href={`/vendors/${category.id}`}
                className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-6 hover:shadow-md transition-all text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-bold text-[#1F1E1B] text-sm group-hover:text-[#8A1C2C] transition-colors mb-1">{category.name}</h3>
                <p className="text-[11px] text-[#1F1E1B]/60 italic leading-relaxed">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Vendors */}
        {vendors && vendors.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2">
              <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
                <span className="text-[#C5A880]">❦</span> Top Rated Vendors
              </h2>
              <Link
                href="/vendors/all"
                className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.slice(0, 9).map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.id}`}
                  className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 bg-[#FAF6F0]">
                      {vendor.cover_image_url ? (
                        <img
                          src={vendor.cover_image_url}
                          alt={vendor.business_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-5xl">
                          {vendor.category === 'photography' ? '📸' :
                           vendor.category === 'decoration' ? '🎨' :
                           vendor.category === 'catering' ? '🍽' : '🏪'}
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-bold text-[#1F1E1B] line-clamp-1 group-hover:text-[#8A1C2C] transition-colors">
                        {vendor.business_name}
                      </h3>
                      <p className="text-xs text-[#1F1E1B]/50 italic capitalize">
                        {vendor.category} • {vendor.city}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-4 border-t border-[#FAF6F0] text-xs font-sans">
                      <div className="flex items-center gap-1 text-yellow-600 font-bold">
                        <span>⭐</span>
                        <span>{vendor.rating ? vendor.rating.toFixed(1) : '4.5'}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        Explore services →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Verified Services', desc: '100% background-checked verified guild members.', icon: '🛡️' },
              { title: 'Secured Payments', desc: 'Protected escrow payment and easy cancellation.', icon: '💳' },
              { title: 'Regal Orchestration', desc: 'Assistance from local managers to guide event flow.', icon: '⚜' }
            ].map((ben, i) => (
              <div key={i} className="bg-white rounded border border-[#DDD0BB] p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">{ben.icon}</div>
                <h3 className="font-bold text-[#1F1E1B] text-sm mb-1">{ben.title}</h3>
                <p className="text-xs text-[#1F1E1B]/60 italic">{ben.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
