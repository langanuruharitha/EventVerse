'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { SAMPLE_VENDORS, VENDOR_CATEGORIES, VENDOR_LOCATIONS, VENDOR_STATES } from '@/lib/data/vendors';

const EVENT_TYPES_MAP: Record<string, { name: string; icon: string }> = {
  'birthday': { name: 'Birthday Party', icon: '🎂' },
  'wedding': { name: 'Wedding Ceremony', icon: '💍' },
  'engagement': { name: 'Engagement Party', icon: '💕' },
  'baby-shower': { name: 'Baby Shower', icon: '👶' },
  'anniversary': { name: 'Anniversary', icon: '💐' },
  'housewarming': { name: 'Housewarming', icon: '🏠' },
  'corporate': { name: 'Corporate Event', icon: '🏢' },
  'festival': { name: 'Festival Celebration', icon: '🎆' },
};

export default function VendorMarketplacePage({ params }: { params: Promise<{ eventType: string }> }) {
  // Use React.use() to unwrap the params promise in client component
  const { eventType: eventTypeSlug } = use(params);
  const eventTypeInfo = EVENT_TYPES_MAP[eventTypeSlug] || { name: 'Event', icon: '🎉' };

  const [minBudget, setMinBudget] = useState(10000);
  const [maxBudget, setMaxBudget] = useState(500000);
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(true);

  // Filter vendors
  const filteredVendors = SAMPLE_VENDORS.filter(vendor => {
    // Budget filter - check if vendor's price range overlaps with selected budget
    const withinBudget = vendor.minPrice <= maxBudget && vendor.maxPrice >= minBudget;
    
    // Location filter
    const matchesLocation = !location || vendor.location.toLowerCase().includes(location.toLowerCase());
    
    // State filter
    const matchesState = !state || vendor.state === state;
    
    // Category filter
    const matchesCategory = category === 'all' || vendor.category === category;

    return withinBudget && matchesLocation && matchesState && matchesCategory;
  });

  const clearFilters = () => {
    setMinBudget(10000);
    setMaxBudget(500000);
    setLocation('');
    setState('');
    setCategory('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{eventTypeInfo.icon}</span>
                <h1 className="text-3xl font-bold text-gray-900">
                  {eventTypeInfo.name} Vendors
                </h1>
              </div>
              <p className="text-gray-600">
                Browse and hire from <strong>{SAMPLE_VENDORS.length}+</strong> professional vendors
              </p>
            </div>
            <Link
              href={`/events/${eventTypeSlug}/diy`}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap"
            >
              🤖 Try DIY Instead
            </Link>
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full py-3 bg-white border-2 border-purple-200 rounded-lg font-semibold mb-4 hover:bg-purple-50 transition-colors"
          >
            {showFilters ? '🔼 Hide Filters' : '🔽 Show Filters'} ({filteredVendors.length} vendors)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Budget Range
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Min: ₹{minBudget.toLocaleString('en-IN')}</label>
                      <input
                        type="range"
                        min="5000"
                        max="500000"
                        step="5000"
                        value={minBudget}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val < maxBudget) setMinBudget(val);
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Max: ₹{maxBudget.toLocaleString('en-IN')}</label>
                      <input
                        type="range"
                        min="10000"
                        max="1000000"
                        step="10000"
                        value={maxBudget}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > minBudget) setMaxBudget(val);
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>
                  <div className="text-center mt-2 p-2 bg-purple-50 rounded-lg">
                    <span className="text-lg font-bold text-purple-600">
                      ₹{minBudget.toLocaleString('en-IN')} - ₹{maxBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  >
                    <option value="all">All Categories</option>
                    {VENDOR_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  >
                    <option value="">All States</option>
                    {VENDOR_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Mumbai, Delhi, Pune"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Or choose from dropdown:</p>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2 text-sm"
                  >
                    <option value="">All Cities</option>
                    {VENDOR_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">
                      Showing <strong className="text-purple-600 text-lg">{filteredVendors.length}</strong> vendors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vendors Grid */}
          <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
            {filteredVendors.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No vendors found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results header */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <p className="text-gray-700">
                    <strong>{filteredVendors.length}</strong> vendors found
                    {category !== 'all' && <> in <strong>{category}</strong></>}
                    {location && <> near <strong>{location}</strong></>}
                    {state && <> in <strong>{state}</strong></>}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100"
                    >
                      {/* Vendor Image/Icon */}
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 text-center relative">
                        <div className="text-6xl mb-2">{vendor.image}</div>
                        {vendor.verified && (
                          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        {/* Name & Category */}
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                            {vendor.name}
                          </h3>
                          <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
                            {vendor.category}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < Math.floor(vendor.rating) ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {vendor.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({vendor.reviews})
                          </span>
                        </div>

                        {/* Location & Price */}
                        <div className="mb-3 space-y-1">
                          <p className="text-sm text-gray-600">
                            📍 {vendor.location}, {vendor.state}
                          </p>
                          <p className="text-sm font-semibold text-purple-600">
                            💰 {vendor.priceRange}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                          {vendor.description}
                        </p>

                        {/* Services */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {vendor.services.slice(0, 3).map((service, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {service}
                              </span>
                            ))}
                            {vendor.services.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                +{vendor.services.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Link href={`/events/${eventTypeSlug}/vendors/${vendor.id}`}>
                            <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                              View Profile
                            </button>
                          </Link>
                          <button className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm shadow">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/events/${eventTypeSlug}`}
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Planning Options
          </Link>
        </div>
      </div>
    </div>
  );
}
