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
    const withinBudget = vendor.minPrice <= maxBudget && vendor.maxPrice >= minBudget;
    const matchesLocation = !location || vendor.location.toLowerCase().includes(location.toLowerCase());
    const matchesState = !state || vendor.state === state;
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

  const inputStyle = {
    background: '#FFFDF8',
    border: '1.5px solid #DDD0BB',
    color: '#2C1810',
    fontFamily: 'Georgia, serif',
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 shadow-md">
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{eventTypeInfo.icon}</span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C1810]">
                  {eventTypeInfo.name} Vendors
                </h1>
              </div>
              <p className="text-sm text-[#1F1E1B]/70 italic">
                Browse and hire from <strong>{SAMPLE_VENDORS.length}+</strong> premium verified event vendors.
              </p>
            </div>
            <div>
              <Link
                href={`/events/${eventTypeSlug}/diy`}
                className="inline-block py-3 px-5 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                  color: '#FAF0E0',
                  boxShadow: '0 4px 16px rgba(138,28,44,0.2)',
                }}
              >
                🤖 Try DIY Plan Instead
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full py-2.5 bg-white border border-[#DDD0BB] rounded text-xs font-semibold uppercase tracking-wider text-[#7A6652]"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'} ({filteredVendors.length} found)
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="md:col-span-1">
              <div className="bg-white rounded border border-[#DDD0BB] p-6 sticky top-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-3">
                  <h2 className="text-lg font-bold text-[#1F1E1B]">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-[#8A1C2C] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Budget Range */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#7A6652]">
                    Budget Range
                  </label>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-[#1F1E1B]/70">Min: ₹{minBudget.toLocaleString('en-IN')}</p>
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
                        className="w-full accent-[#8A1C2C]"
                      />
                    </div>
                    <div>
                      <p className="text-[#1F1E1B]/70">Max: ₹{maxBudget.toLocaleString('en-IN')}</p>
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
                        className="w-full accent-[#8A1C2C]"
                      />
                    </div>
                  </div>
                  <div className="text-center p-2 rounded bg-[#FAF6F0] border border-[#DDD0BB]/50">
                    <span className="text-sm font-bold text-[#8A1C2C] font-sans">
                      ₹{minBudget.toLocaleString('en-IN')} - ₹{maxBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#7A6652]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded outline-none font-serif"
                    style={{ ...inputStyle, appearance: 'auto' }}
                  >
                    <option value="all">All Categories</option>
                    {VENDOR_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#7A6652]">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded outline-none font-serif"
                    style={{ ...inputStyle, appearance: 'auto' }}
                  >
                    <option value="">All States</option>
                    {VENDOR_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#7A6652]">
                    City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Mumbai, Delhi"
                    className="w-full px-4 py-2.5 text-xs rounded outline-none"
                    style={inputStyle}
                  />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDD0BB] rounded mt-2 text-xs"
                    style={{ ...inputStyle, appearance: 'auto' }}
                  >
                    <option value="">All Cities</option>
                    {VENDOR_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Vendors Grid */}
          <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
            {filteredVendors.length === 0 ? (
              <div className="bg-white rounded border border-[#DDD0BB] p-12 text-center shadow-sm">
                <div className="text-5xl mb-4 text-[#C5A880]">🔍</div>
                <h3 className="text-xl font-bold text-[#1F1E1B] mb-2">No Vendors Found</h3>
                <p className="text-xs text-[#1F1E1B]/60 italic mb-6">
                  Try adjusting filters to expand your search.
                </p>
                <button
                  onClick={clearFilters}
                  className="py-2.5 px-6 text-xs font-semibold uppercase tracking-wider rounded"
                  style={{
                    background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                    color: '#FAF0E0',
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded border border-[#DDD0BB] p-4 text-xs font-sans text-[#7A6652]">
                  <strong>{filteredVendors.length}</strong> professional vendors matching criteria
                  {category !== 'all' && <> in <strong>{category}</strong></>}
                  {location && <> near <strong>{location}</strong></>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      {/* Image/Icon Header */}
                      <div className="bg-[#FAF6F0] p-8 text-center relative border-b border-[#FAF6F0]">
                        <div className="text-5xl group-hover:scale-105 transition-transform">{vendor.image}</div>
                        {vendor.verified && (
                          <span className="absolute top-2 right-2 bg-green-700 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-[#1F1E1B] text-base line-clamp-1 group-hover:text-[#8A1C2C] transition-colors">
                              {vendor.name}
                            </h3>
                            <span className="inline-block bg-[#FAF6F0] border border-[#C5A880]/30 text-[#C5A880] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider mt-1.5">
                              {vendor.category}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 text-xs font-sans">
                            <span className="text-yellow-600">⭐</span>
                            <span className="font-bold text-[#1F1E1B]/70">{vendor.rating}</span>
                            <span className="text-[#1F1E1B]/40">({vendor.reviews} reviews)</span>
                          </div>

                          <div className="text-xs text-[#1F1E1B]/60 space-y-1">
                            <p>📍 {vendor.location}, {vendor.state}</p>
                            <p className="font-bold text-[#8A1C2C] font-sans">💰 {vendor.priceRange}</p>
                          </div>

                          <p className="text-[11px] text-[#1F1E1B]/60 italic line-clamp-2 leading-relaxed">
                            {vendor.description}
                          </p>

                          {/* Services */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {vendor.services.slice(0, 2).map((service, idx) => (
                              <span key={idx} className="text-[10px] bg-[#FAF6F0] border border-[#DDD0BB]/40 text-[#7A6652] px-2 py-0.5 rounded font-sans">
                                {service}
                              </span>
                            ))}
                            {vendor.services.length > 2 && (
                              <span className="text-[10px] bg-[#FAF6F0] border border-[#DDD0BB]/40 text-[#7A6652] px-2 py-0.5 rounded font-sans">
                                +{vendor.services.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#FAF6F0]">
                          <Link href={`/events/${eventTypeSlug}/vendors/${vendor.id}`}>
                            <span className="w-full inline-flex items-center justify-center py-2 border border-[#DDD0BB] text-xs font-semibold uppercase tracking-wider rounded text-[#7A6652] hover:bg-[#FAF6F0] transition-colors">
                              Profile
                            </span>
                          </Link>
                          <button
                            className="w-full py-2 text-xs font-semibold uppercase tracking-wider rounded text-white"
                            style={{ background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)' }}
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link
            href={`/events/${eventTypeSlug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1F1E1B]/70 hover:text-[#8A1C2C] uppercase tracking-wider font-sans transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Planning Options
          </Link>
        </div>
      </div>
    </div>
  );
}
