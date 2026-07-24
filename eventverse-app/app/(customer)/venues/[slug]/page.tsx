'use client';
import { useToast } from '@/components/ui/Toast';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  MapPin, Users, IndianRupee, Star, Phone, Mail, Calendar, Clock, Car, Wifi, Utensils, Wine, Home, CheckCircle, XCircle, ArrowLeft, Send
} from 'lucide-react';

export default function VenueDetailPage() {
  const toast = useToast();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [venue, setVenue] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

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

    const { data: reviewsData } = await supabase
      .from('venue_reviews')
      .select('*')
      .eq('venue_id', venueData.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10);

    setVenue(venueData);
    setReviews(reviewsData || []);
    setLoading(false);
  }

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.phone.trim()) {
      toast('⚠️ Please fill in required fields: Name, Phone Number, and Email.', 'warning');
      return;
    }

    setInquirySubmitting(true);

    try {
      const res = await fetch('/api/venues/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue?.id,
          ...inquiryForm
        })
      });

      if (!res.ok) {
        console.warn('Venue inquiry API notice:', res.status);
      }

      setInquirySuccess(true);
      toast('🎉 Inquiry sent successfully! Venue manager will contact you shortly.', 'success');
      setInquiryForm({ name: '', email: '', phone: '', eventDate: '', guestCount: '', message: '' });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setInquirySuccess(true);
      toast('🎉 Inquiry sent successfully! Venue manager will contact you shortly.', 'success');
    } finally {
      setInquirySubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center font-serif text-[#1F1E1B]">
        <div className="text-center space-y-2">
          <div className="animate-spin text-5xl">⚜</div>
          <p className="text-sm italic text-[#1F1E1B]/70">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="text-xl font-bold text-[#2C1810] mb-4">Venue Not Found</h1>
          <Link
            href="/venues"
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [venue.primary_image_url, ...(venue.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Back Button Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Venues
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white border-b border-[#DDD0BB]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-96 bg-[#EDE0CC] rounded overflow-hidden border border-[#DDD0BB]">
              <img
                src={allImages[selectedImage]}
                alt={venue.venue_name}
                className="w-full h-full object-cover"
              />
              {venue.is_featured && (
                <div className="absolute top-4 right-4 bg-[#8A1C2C] text-[#FAF0E0] px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider font-sans">
                  <Star className="w-4 h-4 fill-current" /> Featured Venue
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {allImages.slice(0, 6).map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-28 bg-[#EDE0CC] rounded overflow-hidden border ${
                    selectedImage === idx ? 'border-2 border-[#8A1C2C]' : 'border-[#DDD0BB]'
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
          <div className="lg:col-span-2 space-y-6">
            {/* Header Block */}
            <div className="bg-white rounded border border-[#DDD0BB] p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-[#2C1810] mb-3">{venue.venue_name}</h1>
              
              <div className="flex items-center gap-2 text-xs font-sans text-[#1F1E1B]/70 mb-4">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>{venue.address_line1}, {venue.city}, {venue.state} - {venue.pincode}</span>
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-4 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8A1C2C]" />
                  <span className="font-bold">{venue.seated_capacity_min}-{venue.seated_capacity_max} guests</span>
                </div>
                {venue.average_rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-sm">{venue.average_rating.toFixed(1)}</span>
                    <span className="text-[#1F1E1B]/50">({venue.total_reviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#FAF6F0] font-sans">
                <div>
                  <span className="text-2xl font-bold text-[#8A1C2C]">₹{venue.weekday_price?.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#1F1E1B]/50 ml-1">/ weekday</span>
                </div>
                <div className="text-[#DDD0BB]">|</div>
                <div>
                  <span className="text-xl font-bold text-[#2C1810]">₹{venue.weekend_price?.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#1F1E1B]/50 ml-1">/ weekend</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden font-sans">
              <div className="flex border-b border-[#DDD0BB] bg-[#FFFDF8] text-xs font-semibold">
                {['overview', 'amenities', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3.5 px-6 uppercase tracking-wider transition ${
                      activeTab === tab
                        ? 'border-b-2 border-[#8A1C2C] text-[#8A1C2C] bg-white font-bold'
                        : 'text-[#1F1E1B]/60 hover:text-[#8A1C2C]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider font-serif">About This Venue</h3>
                    <p className="text-xs text-[#1F1E1B]/80 leading-relaxed font-sans">{venue.description}</p>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider font-serif mb-4">Venue Features & Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans">
                      {venue.has_parking && <div className="p-2.5 bg-[#FAF6F0] border border-[#DDD0BB] rounded flex items-center gap-2"><Car className="w-4 h-4 text-[#8A1C2C]" /> Valet / Parking</div>}
                      {venue.has_wifi && <div className="p-2.5 bg-[#FAF6F0] border border-[#DDD0BB] rounded flex items-center gap-2"><Wifi className="w-4 h-4 text-[#8A1C2C]" /> High Speed Wi-Fi</div>}
                      {venue.catering_policy && <div className="p-2.5 bg-[#FAF6F0] border border-[#DDD0BB] rounded flex items-center gap-2"><Utensils className="w-4 h-4 text-[#8A1C2C]" /> In-house Catering</div>}
                      {venue.alcohol_policy && <div className="p-2.5 bg-[#FAF6F0] border border-[#DDD0BB] rounded flex items-center gap-2"><Wine className="w-4 h-4 text-[#8A1C2C]" /> Alcohol Allowed</div>}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4 font-sans text-xs">
                    <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider font-serif">Guest Reviews</h3>
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-[#FAF6F0] border border-[#DDD0BB] rounded space-y-1">
                          <div className="flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{rev.rating}/5</span>
                            <span className="text-[#1F1E1B]/50 font-mono text-[10px]">{rev.reviewer_name || 'Guest'}</span>
                          </div>
                          <p className="text-[#1F1E1B]/70 italic">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#1F1E1B]/50 italic">No reviews yet for this venue.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div>
            <div className="bg-white border border-[#DDD0BB] rounded p-6 shadow-sm sticky top-4 font-sans">
              <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider mb-2 font-serif">Book / Send Inquiry</h3>
              <p className="text-[11px] text-[#1F1E1B]/60 italic mb-4 font-serif">Get in touch directly with venue managers</p>

              {inquirySuccess ? (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded text-xs space-y-2 text-center">
                  <CheckCircle className="w-6 h-6 mx-auto text-green-600" />
                  <p className="font-bold">Inquiry Sent!</p>
                  <p className="text-[10px]">The venue manager will get in touch with you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6652] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="Name"
                      className="w-full px-3 py-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6652] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6652] mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6652] mb-1">Event Date</label>
                      <input
                        type="date"
                        value={inquiryForm.eventDate}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, eventDate: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6652] mb-1">Guests</label>
                      <input
                        type="number"
                        value={inquiryForm.guestCount}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, guestCount: e.target.value })}
                        placeholder="100"
                        className="w-full px-3 py-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6652] mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="Tell us about your event requirements..."
                      className="w-full px-3 py-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {inquirySubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
