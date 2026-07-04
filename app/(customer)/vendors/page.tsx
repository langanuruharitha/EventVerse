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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🏪 Vendor Marketplace</h1>
          <p className="text-2xl mb-8 text-purple-100">
            Discover trusted vendors for your event!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search photographers, caterers, decorators..."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {vendorCategories.map((category) => (
              <Link
                key={category.id}
                href={`/vendors/${category.id}`}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-center"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Vendors */}
        {vendors && vendors.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">⭐ Top Rated Vendors</h2>
              <Link
                href="/vendors/all"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.slice(0, 9).map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                    {vendor.cover_image_url ? (
                      <img
                        src={vendor.cover_image_url}
                        alt={vendor.business_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-6xl">
                        {vendor.category === 'photography' ? '📸' :
                         vendor.category === 'decoration' ? '🎨' :
                         vendor.category === 'catering' ? '🍽️' : '🎉'}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span>{vendor.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {vendor.business_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {vendor.bio || 'Professional event services'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 capitalize">
                        {vendor.category}
                      </span>
                      <span className="text-sm font-semibold text-purple-600">
                        {vendor.location}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      📍 {vendor.service_radius_km || 50}km radius
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Why Choose Our Vendors */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our Vendors?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="font-bold text-gray-900 mb-2">Verified</h3>
              <p className="text-sm text-gray-600">All vendors are verified & background checked</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-gray-900 mb-2">Top Rated</h3>
              <p className="text-sm text-gray-600">Only the best rated vendors on our platform</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive pricing with no hidden charges</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">Safe bookings with secure payment</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Are you a vendor?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Join our marketplace and grow your business!
          </p>
          <Link
            href="/vendor/register"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Register as Vendor
          </Link>
        </section>
      </div>
    </div>
  );
}
