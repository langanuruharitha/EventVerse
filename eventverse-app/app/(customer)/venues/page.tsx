'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, IndianRupee, Star } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function VenuesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredVenues, setFeaturedVenues] = useState<any[]>([]);
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filters
  const [searchLocation, setSearchLocation] = useState('');
  const [searchGuests, setSearchGuests] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: categoriesData } = await supabase
      .from('venue_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    const { data: featuredData } = await supabase
      .from('venues')
      .select('*')
      .eq('listing_status', 'active')
      .eq('is_featured', true)
      .limit(6);

    const { data: allData } = await supabase
      .from('venues')
      .select('*')
      .eq('listing_status', 'active')
      .order('average_rating', { ascending: false });

    setCategories(categoriesData || []);
    setFeaturedVenues(featuredData || []);
    
    const sortedVenues = (allData || []).sort((a, b) => b.average_rating - a.average_rating);
    setAllVenues(sortedVenues);
    setFilteredVenues(sortedVenues);
    setLoading(false);
  }

  function handleSearch() {
    setSearchActive(true);
    
    if (!searchLocation && !searchGuests && !searchBudget) {
      setFilteredVenues(allVenues);
      setSearchActive(false);
      return;
    }

    let filtered = [...allVenues];

    if (searchLocation) {
      const locationLower = searchLocation.toLowerCase().trim();
      filtered = filtered.filter(
        (venue) =>
          venue.city?.toLowerCase().includes(locationLower) ||
          venue.state?.toLowerCase().includes(locationLower) ||
          venue.address_line1?.toLowerCase().includes(locationLower)
      );
    }

    if (searchGuests) {
      const guestCount = parseInt(searchGuests);
      filtered = filtered.filter(
        (venue) =>
          guestCount >= venue.seated_capacity_min &&
          guestCount <= venue.seated_capacity_max
      );
    }

    if (searchBudget) {
      const budgetAmount = parseInt(searchBudget);
      filtered = filtered.filter(
        (venue) => venue.weekday_price <= budgetAmount
      );
    }

    filtered.sort((a, b) => {
      if (searchBudget) {
        const budgetAmount = parseInt(searchBudget);
        const aDiff = Math.abs(a.weekday_price - budgetAmount);
        const bDiff = Math.abs(b.weekday_price - budgetAmount);
        if (aDiff !== bDiff) return aDiff - bDiff;
      }

      if (searchGuests) {
        const guestCount = parseInt(searchGuests);
        const aCapacityDiff = Math.abs(a.seated_capacity_max - guestCount);
        const bCapacityDiff = Math.abs(b.seated_capacity_max - guestCount);
        if (aCapacityDiff !== bCapacityDiff) return aCapacityDiff - bCapacityDiff;
      }

      return b.average_rating - a.average_rating;
    });

    setFilteredVenues(filtered);
  }

  function handleReset() {
    setSearchLocation('');
    setSearchGuests('');
    setSearchBudget('');
    setSearchActive(false);
    setFilteredVenues(allVenues);
  }

  const inputStyle = {
    background: '#FFFDF8',
    border: '1.5px solid #DDD0BB',
    color: '#2C1810',
    fontFamily: 'Georgia, serif',
  };

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
              ⚜ Heritage Venues
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1810]">
              Discover Perfect Venues
            </h1>
            <p className="text-sm sm:text-base text-[#1F1E1B]/70 italic max-w-xl mx-auto">
              "Exquisite halls, royal gardens, and luxury banquets for hosting your classic events."
            </p>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A880]" />
              <span className="text-xs text-[#C5A880]">❦</span>
              <div className="h-px w-16 bg-gradient-to-r from-[#C5A880] to-transparent" />
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-[#FFFDF8] rounded border border-[#DDD0BB] p-6 shadow-sm mt-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Location (city, area)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded text-sm outline-none font-serif"
                    style={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="number"
                    placeholder="Guests"
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                    className="w-full px-4 py-3 rounded text-sm outline-none font-serif"
                    style={inputStyle}
                  />
                </div>
                <div className="md:col-span-3">
                  <input
                    type="number"
                    placeholder="Budget (₹)"
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded text-sm outline-none font-serif"
                    style={inputStyle}
                  />
                </div>
                <div className="md:col-span-3 flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 py-3 text-xs font-semibold tracking-wider uppercase rounded transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                      color: '#FAF0E0',
                    }}
                  >
                    Search
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider border border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0] transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded border border-[#DDD0BB] shadow-sm">
            <div className="animate-spin text-5xl mb-4">⚜</div>
            <p className="text-lg italic text-[#1F1E1B]/70">Gathering venue catalogs...</p>
          </div>
        ) : (
          <>
            {/* Venue Categories */}
            {categories.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
                  <span className="text-[#C5A880]">❦</span> Browse by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/venues?category=${category.id}`}
                      className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-6 text-center hover:shadow-md transition-all group"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏛️</div>
                      <h3 className="font-bold text-[#1F1E1B] text-sm">{category.category_name}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Featured Venues */}
            {featuredVenues.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
                  <span className="text-[#C5A880]">❦</span> Featured Venues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              </section>
            )}

            {/* Search Results or All Venues */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
                <span className="text-[#C5A880]">❦</span> {searchActive ? 'Search Results' : 'All Venues'}
              </h2>
              <p className="text-xs text-[#1F1E1B]/60 italic">
                Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} listed in register.
              </p>

              {filteredVenues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded border border-[#DDD0BB] shadow-sm max-w-2xl mx-auto p-8">
                  <div className="text-5xl mb-4 text-[#C5A880]">🔍</div>
                  <h3 className="text-xl font-bold text-[#1F1E1B] mb-2">No Venues Found</h3>
                  <p className="text-xs text-[#1F1E1B]/60 italic mb-6">
                    No venues match your search criteria. Try clearing search filters to see all.
                  </p>
                  <button
                    onClick={handleReset}
                    className="py-2.5 px-6 text-xs font-semibold uppercase tracking-wider rounded"
                    style={{
                      background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                      color: '#FAF0E0',
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function VenueCard({ venue }: { venue: any }) {
  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col justify-between"
    >
      <div>
        {/* Image */}
        <div className="relative h-48 bg-[#FAF6F0] overflow-hidden">
          {venue.primary_image_url ? (
            <img
              src={venue.primary_image_url}
              alt={venue.venue_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🏛️</div>
          )}
          {venue.is_featured && (
            <div className="absolute top-2 right-2 bg-[#C5A880] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-[#1F1E1B] line-clamp-1 group-hover:text-[#8A1C2C] transition-colors">
            {venue.venue_name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-[#1F1E1B]/60 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{venue.city}, {venue.state}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Users className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{venue.seated_capacity_min}-{venue.seated_capacity_max} guests</span>
            </div>
            {venue.average_rating > 0 && (
              <div className="flex items-center gap-1 text-yellow-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{venue.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAF6F0]">
          <div className="flex items-baseline gap-0.5">
            <IndianRupee className="w-3.5 h-3.5 text-[#8A1C2C]" />
            <span className="text-xl font-bold text-[#8A1C2C] font-sans">
              {venue.weekday_price?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#1F1E1B]/50 ml-1">/ day</span>
          </div>
          <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider font-sans group-hover:translate-x-1 transition-transform">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
