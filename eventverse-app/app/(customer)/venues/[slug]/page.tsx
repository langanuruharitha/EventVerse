'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  MapPin,
  Users,
  IndianRupee,
  Star,
  Phone,
  Mail,
  Calendar,
  Clock,
  Car,
  Wifi,
  Utensils,
  Wine,
  Home,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Send,
  Image as ImageIcon,
} from 'lucide-react';

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [venue, setVenue] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    message: '',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    loadVenueData();
  }, [slug]);

  async function loadVenueData() {
    setLoading(true);

    // Fetch venue details
    const { data: venueData, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('slug', slug)
      .single();

    if (venueError || !venueData) {
      console.error('Venue not found:', venueError);
      setLoading(false);
      return;
    }

    // Fetch reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('venue_reviews')
      .select('*')
      .eq('venue_id', venueData.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (reviewsError) {
      console.error('Reviews fetch error:', reviewsError);
    }

    setVenue(venueData);
    setReviews(reviewsData || []);
    setLoading(false);
  }

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setInquirySubmitting(true);

    try {
      const supabase = createBrowserClient();
      
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      
      const insertData = {
        venue_id: venue.id,
        user_id: user?.id || null, // Allow null for anonymous users
        full_name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        event_date: inquiryForm.eventDate,
        guest_count: parseInt(inquiryForm.guestCount),
        message: inquiryForm.message,
        status: 'pending',
      };

      console.log('Submitting inquiry:', insertData);

      const { data, error } = await supabase
        .from('venue_inquiries')
        .insert(insertData)
        .select();

      console.log('Inquiry response:', { data, error });

      if (error) {
        console.error('Inquiry error:', error);
        alert(`Failed to send inquiry: ${error.message}`);
      } else {
        setInquirySuccess(true);
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          guestCount: '',
          message: '',
        });
        alert('✅ Inquiry sent successfully! We will contact you soon.');
        setTimeout(() => setInquirySuccess(false), 5000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setInquirySubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Venue Not Found</h1>
          <p className="text-gray-600 mb-6">
            The venue you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [venue.primary_image_url, ...(venue.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Venues
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={allImages[selectedImage]}
                alt={venue.venue_name}
                className="w-full h-full object-cover"
              />
              {venue.is_featured && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-4">
              {allImages.slice(0, 6).map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-28 bg-gray-200 rounded-lg overflow-hidden ${
                    selectedImage === idx ? 'ring-4 ring-purple-600' : ''
                  }`}
                >
                  <img src={image} alt={`${venue.venue_name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Header */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{venue.venue_name}</h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>
                  {venue.address_line1}, {venue.city}, {venue.state} - {venue.pincode}
                </span>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">
                    {venue.seated_capacity_min}-{venue.seated_capacity_max} guests
                  </span>
                </div>
                {venue.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{venue.average_rating.toFixed(1)}</span>
                    <span className="text-gray-500">({venue.total_reviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-purple-600" />
                  <div>
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{venue.weekday_price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-500 ml-2">weekday</span>
                  </div>
                </div>
                <div className="text-gray-500">|</div>
                <div>
                  <span className="text-2xl font-bold text-gray-700">
                    ₹{venue.weekend_price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-500 ml-2">weekend</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="border-b">
                <div className="flex gap-4 px-6">
                  {['overview', 'amenities', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-4 font-semibold capitalize ${
                        activeTab === tab
                          ? 'border-b-4 border-purple-600 text-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About This Venue</h3>
                      <p className="text-gray-700 leading-relaxed">{venue.description}</p>
                    </div>

                    {venue.highlights && venue.highlights.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Highlights</h3>
                        <ul className="space-y-2">
                          {venue.highlights.map((highlight: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Venue Type</h3>
                      <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-lg capitalize">
                        {venue.venue_type?.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Catering</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Veg Per Plate</p>
                          <p className="font-semibold">
                            ₹{venue.per_plate_veg_min} - ₹{venue.per_plate_veg_max}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Non-Veg Per Plate</p>
                          <p className="font-semibold">
                            ₹{venue.per_plate_nonveg_min} - ₹{venue.per_plate_nonveg_max}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AmenityItem
                      icon={<CheckCircle className="w-5 h-5" />}
                      label="Air Conditioning"
                      available={venue.is_ac}
                    />
                    <AmenityItem
                      icon={<CheckCircle className="w-5 h-5" />}
                      label="Outdoor Space"
                      available={venue.is_outdoor}
                    />
                    <AmenityItem
                      icon={<Car className="w-5 h-5" />}
                      label={`Parking: ${venue.parking_cars} cars, ${venue.parking_bikes} bikes`}
                      available={venue.parking_cars > 0}
                    />
                    <AmenityItem
                      icon={<Wifi className="w-5 h-5" />}
                      label="WiFi"
                      available={venue.has_wifi}
                    />
                    <AmenityItem
                      icon={<CheckCircle className="w-5 h-5" />}
                      label="Power Backup"
                      available={venue.has_power_backup}
                    />
                    <AmenityItem
                      icon={<Utensils className="w-5 h-5" />}
                      label="Outside Catering Allowed"
                      available={venue.allows_outside_catering}
                    />
                    <AmenityItem
                      icon={<Wine className="w-5 h-5" />}
                      label="Alcohol Allowed"
                      available={venue.allows_alcohol}
                    />
                    <AmenityItem
                      icon={<CheckCircle className="w-5 h-5" />}
                      label="Wheelchair Accessible"
                      available={venue.is_wheelchair_accessible}
                    />
                    {venue.has_accommodation && (
                      <AmenityItem
                        icon={<Home className="w-5 h-5" />}
                        label={`Accommodation: ${venue.accommodation_rooms} rooms`}
                        available={true}
                      />
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                C
                              </div>
                              <div>
                                <p className="font-semibold">Verified Customer</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'text-yellow-500 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {review.title && <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>}
                          <p className="text-gray-700">{review.review_text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No reviews yet. Be the first to review!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Send Inquiry</h2>

              {inquirySuccess && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                  ✅ Inquiry sent successfully! We'll contact you soon.
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={inquiryForm.eventDate}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, eventDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Count *</label>
                  <input
                    type="number"
                    required
                    value={inquiryForm.guestCount}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, guestCount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {inquirySubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Security Deposit:</strong> ₹{venue.security_deposit?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500">
                  * Final pricing may vary based on event requirements and date
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmenityItem({
  icon,
  label,
  available,
}: {
  icon: React.ReactNode;
  label: string;
  available: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${available ? 'bg-green-50' : 'bg-gray-50'}`}>
      <div className={available ? 'text-green-600' : 'text-gray-400'}>{icon}</div>
      <span className={`font-medium ${available ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
      {!available && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
    </div>
  );
}
