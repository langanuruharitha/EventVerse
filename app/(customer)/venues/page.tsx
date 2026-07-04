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

    // Fetch venue categories
    const { data: categoriesData } = await supabase
      .from('venue_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    // Fetch featured venues
    const { data: featuredData } = await supabase
      .from('venues')
      .select('*')
      .eq('listing_status', 'active')
      .eq('is_featured', true)
      .limit(6);

    // Fetch all active venues
    const { data: allData } = await supabase
      .from('venues')
      .select('*')
      .eq('listing_status', 'active')
      .order('average_rating', { ascending: false });

    setCategories(categoriesData || []);
    setFeaturedVenues(featuredData || []);
    
    // Sort all venues by rating initially
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
    
    console.log('Starting search with:', { searchLocation, searchGuests, searchBudget });
    console.log('Total venues before filter:', filtered.length);

    // Filter by location (city or state)
    if (searchLocation) {
      const locationLower = searchLocation.toLowerCase().trim();
      filtered = filtered.filter(
        (venue) =>
          venue.city?.toLowerCase().includes(locationLower) ||
          venue.state?.toLowerCase().includes(locationLower) ||
          venue.address_line1?.toLowerCase().includes(locationLower)
      );
      console.log('After location filter:', filtered.length);
    }

    // Filter by guest capacity
    if (searchGuests) {
      const guestCount = parseInt(searchGuests);
      filtered = filtered.filter(
        (venue) =>
          guestCount >= venue.seated_capacity_min &&
          guestCount <= venue.seated_capacity_max
      );
      console.log('After guest filter:', filtered.length, 'for', guestCount, 'guests');
    }

    // Filter by budget
    if (searchBudget) {
      const budgetAmount = parseInt(searchBudget);
      filtered = filtered.filter(
        (venue) => venue.weekday_price <= budgetAmount
      );
      console.log('After budget filter:', filtered.length, 'under ₹', budgetAmount);
    }

    // Sort results by relevance
    // 1. By budget (closest to user's budget first)
    // 2. By capacity match (best fit for guest count)
    // 3. By rating
    filtered.sort((a, b) => {
      // If budget specified, sort by price proximity
      if (searchBudget) {
        const budgetAmount = parseInt(searchBudget);
        const aDiff = Math.abs(a.weekday_price - budgetAmount);
        const bDiff = Math.abs(b.weekday_price - budgetAmount);
        if (aDiff !== bDiff) return aDiff - bDiff;
      }

      // If guests specified, sort by capacity match
      if (searchGuests) {
        const guestCount = parseInt(searchGuests);
        const aCapacityDiff = Math.abs(a.seated_capacity_max - guestCount);
        const bCapacityDiff = Math.abs(b.seated_capacity_max - guestCount);
        if (aCapacityDiff !== bCapacityDiff) return aCapacityDiff - bCapacityDiff;
      }

      // Finally sort by rating
      return b.average_rating - a.average_rating;
    });

    console.log('Final filtered venues:', filtered.length);
    setFilteredVenues(filtered);
  }

  function handleReset() {
    setSearchLocation('');
    setSearchGuests('');
    setSearchBudget('');
    setSearchActive(false);
    setFilteredVenues(allVenues);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🏛️ Discover Perfect Venues</h1>
          <p className="text-2xl mb-8 text-purple-100">
            Find the ideal space for your special event
          </p>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <input
                  type="text"
                  placeholder="Location (city, area)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  placeholder="Guest count"
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="number"
                  placeholder="Budget (₹)"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div className="md:col-span-4 flex gap-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading venues...</p>
          </div>
        ) : (
          <>
            {/* Venue Categories */}
            {categories.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/venues?category=${category.id}`}
                      className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all border border-gray-200 hover:border-purple-500"
                    >
                      <div className="text-4xl mb-3">🏛️</div>
                      <h3 className="font-semibold text-gray-900">{category.category_name}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Featured Venues */}
            {featuredVenues.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">⭐ Featured Venues</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              </section>
            )}

            {/* Search Results or All Venues */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {searchActive
                  ? 'Search Results'
                  : 'All Venues'}
              </h2>
              <p className="text-gray-600 mb-6">
                Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
                {searchActive && (
                  <span className="ml-2">
                    {searchLocation && `in ${searchLocation}`}
                    {searchGuests && ` • ${searchGuests} guests`}
                    {searchBudget && ` • under ₹${parseInt(searchBudget).toLocaleString('en-IN')}`}
                  </span>
                )}
              </p>

              {filteredVenues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              ) : searchActive ? (
                <div className="text-center py-20 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Venues Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchGuests && parseInt(searchGuests) > 1000 ? (
                      <>
                        No venues available for {searchGuests} guests.
                        <br />
                        Most venues accommodate up to 1000 guests.
                        <br />
                        Try searching with a lower guest count.
                      </>
                    ) : (
                      <>
                        No venues match your search criteria.
                        <br />
                        Try adjusting your filters or search a different location.
                      </>
                    )}
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Venues Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Venues will appear here once they are added to the platform
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Go to Dashboard
                  </Link>
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
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
        {venue.primary_image_url ? (
          <img
            src={venue.primary_image_url}
            alt={venue.venue_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🏛️
          </div>
        )}
        {venue.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {venue.venue_name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {venue.city}, {venue.state}
          </span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1 text-gray-700">
            <Users className="w-4 h-4" />
            <span>
              {venue.seated_capacity_min}-{venue.seated_capacity_max} guests
            </span>
          </div>
          {venue.average_rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{venue.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <IndianRupee className="w-5 h-5 text-purple-600" />
          <div>
            <span className="text-2xl font-bold text-purple-600">
              ₹{venue.weekday_price?.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ day</span>
          </div>
        </div>

        {/* Features/Highlights Preview */}
        {venue.highlights && venue.highlights.length > 0 && (
          <div className="mt-3 text-xs text-gray-600">
            ✨ {venue.highlights[0]}
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {venue.is_ac && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              AC
            </span>
          )}
          {venue.parking_cars > 0 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Parking
            </span>
          )}
          {venue.has_accommodation && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              Stay
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
