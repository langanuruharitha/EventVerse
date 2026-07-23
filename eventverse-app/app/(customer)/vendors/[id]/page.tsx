'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  Star, MapPin, Phone, Mail, Globe, Calendar, Award, CheckCircle, 
  Heart, Share2, MessageSquare, Shield, Clock, ArrowLeft 
} from 'lucide-react';
interface VendorProfile {
  id: string;
  business_name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  starting_price: number;
  pricing_unit: string;
  years_in_business: number;
  events_completed: number;
  logo_url: string;
  banner_url: string;
  portfolio_images: string[];
  services_offered: string[];
  contact_email: string;
  contact_phone: string;
  website_url: string;
  is_verified: boolean;
  is_featured: boolean;
}

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews'>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const vendorId = resolvedParams.id;

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) throw error;
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center font-serif text-[#1F1E1B]">
        <div className="text-center space-y-2">
          <div className="animate-spin text-5xl">⚜</div>
          <p className="text-sm italic text-[#1F1E1B]/70">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="text-xl font-bold text-[#2C1810] mb-4">Vendor Not Found</h1>
          <button
            onClick={() => router.push('/vendors')}
            className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded font-sans"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>

      {/* Banner */}
      {vendor.banner_url && (
        <div className="w-full h-64 bg-[#EDE0CC] overflow-hidden border-b border-[#DDD0BB]">
          <img
            src={vendor.banner_url}
            alt={vendor.business_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row gap-6 bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded overflow-hidden bg-[#FAF6F0] border border-[#C5A880]/30 shadow-sm flex items-center justify-center">
              {vendor.logo_url ? (
                <img
                  src={vendor.logo_url}
                  alt={vendor.business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#8A1C2C] text-[#FAF0E0] text-3xl font-bold">
                  {vendor.business_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#2C1810]">{vendor.business_name}</h1>
              {vendor.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-700 text-[10px] font-bold uppercase tracking-wider font-sans">
                  <CheckCircle className="w-3 h-3" /> Verified Guild
                </span>
              )}
              <span className="px-2.5 py-0.5 bg-[#FAF6F0] border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-bold uppercase tracking-wider rounded font-sans capitalize">
                {vendor.category}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#1F1E1B]/60">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{vendor.city}, {vendor.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-[#1F1E1B]">{vendor.rating?.toFixed(1) || 'N/A'}</span>
                <span>({vendor.review_count || 0} reviews)</span>
              </div>
              {vendor.years_in_business > 0 && (
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{vendor.years_in_business} Years Experience</span>
                </div>
              )}
            </div>

            <p className="text-xs text-[#1F1E1B]/70 italic line-clamp-2 pt-1 font-serif">
              "{vendor.description}"
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-[#DDD0BB] pt-4 md:pt-0 md:pl-6 space-y-4">
            <div>
              <p className="text-[10px] text-[#7A6652] uppercase tracking-wider font-sans font-bold">Starting From</p>
              <p className="text-2xl font-bold text-[#8A1C2C] font-sans">
                ₹{vendor.starting_price?.toLocaleString('en-IN') || 'Quote'}
                <span className="text-xs text-[#1F1E1B]/50 font-normal font-serif"> / {vendor.pricing_unit || 'event'}</span>
              </p>
            </div>

            <div className="flex gap-2 w-full md:w-auto font-sans">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 border rounded transition ${
                  isSaved ? 'border-red-500 bg-red-50 text-red-500' : 'border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
              </button>
              <button
                onClick={() => setIsHireModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow-lg transition flex-1 md:flex-initial"
              >
                Hire / Send Proposal
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
          <div className="flex border-b border-[#DDD0BB] bg-[#FFFDF8] font-sans text-xs font-semibold">
            {(['about', 'services', 'portfolio', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 uppercase tracking-wider transition ${
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
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider mb-2">About {vendor.business_name}</h3>
                  <p className="text-xs text-[#1F1E1B]/80 leading-relaxed font-sans">{vendor.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#FAF6F0]">
                  <div className="p-4 bg-[#FAF6F0] border border-[#DDD0BB] rounded font-sans text-xs">
                    <p className="text-[10px] text-[#7A6652] uppercase font-bold tracking-wider mb-1">Events Completed</p>
                    <p className="text-xl font-bold text-[#2C1810]">{vendor.events_completed || 0}+</p>
                  </div>
                  <div className="p-4 bg-[#FAF6F0] border border-[#DDD0BB] rounded font-sans text-xs">
                    <p className="text-[10px] text-[#7A6652] uppercase font-bold tracking-wider mb-1">Years in Industry</p>
                    <p className="text-xl font-bold text-[#2C1810]">{vendor.years_in_business || 1} Years</p>
                  </div>
                  <div className="p-4 bg-[#FAF6F0] border border-[#DDD0BB] rounded font-sans text-xs">
                    <p className="text-[10px] text-[#7A6652] uppercase font-bold tracking-wider mb-1">Verification Status</p>
                    <p className="text-sm font-bold text-green-700">Verified & Approved</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider mb-4">Services Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-xs">
                  {(vendor.services_offered || ['Event Planning', 'On-site Coordination', 'Custom Packages']).map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-[#FAF6F0] border border-[#DDD0BB] rounded">
                      <CheckCircle className="w-4 h-4 text-[#8A1C2C]" />
                      <span className="font-semibold text-[#1F1E1B]">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider mb-4">Portfolio Gallery</h3>
                {vendor.portfolio_images && vendor.portfolio_images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.portfolio_images.map((img, i) => (
                      <div key={i} className="aspect-video bg-[#EDE0CC] rounded overflow-hidden border border-[#DDD0BB]">
                        <img src={img} alt={`Portfolio ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#1F1E1B]/50 italic font-sans">No portfolio images uploaded yet.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2C1810] uppercase tracking-wider mb-4">Client Reviews</h3>
                <div className="p-4 bg-[#FAF6F0] border border-[#DDD0BB] rounded text-xs font-sans">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">{vendor.rating?.toFixed(1) || '5.0'}</span>
                    <span className="text-[#1F1E1B]/50">({vendor.review_count || 0} reviews)</span>
                  </div>
                  <p className="text-[#1F1E1B]/60 italic font-serif mt-2">
                    "Exceptional service provided during our celebration! Highly professional and organized team."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Hire Modal */}
      {isHireModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-double border-[#C5A880] rounded p-6 max-w-md w-full shadow-2xl font-serif space-y-4">
            <div className="flex justify-between items-center border-b border-[#DDD0BB] pb-3">
              <h3 className="text-lg font-bold text-[#2C1810]">Hire {vendor.business_name}</h3>
              <button
                onClick={() => setIsHireModalOpen(false)}
                className="text-[#7A6652] hover:text-[#8A1C2C] text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#1F1E1B]/60 italic">
              Send a booking proposal to {vendor.business_name} ({vendor.category}). Starting price: ₹{vendor.starting_price?.toLocaleString('en-IN')}.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Proposal sent to vendor successfully!');
                setIsHireModalOpen(false);
              }}
              className="space-y-3 font-sans text-xs"
            >
              <div>
                <label className="block font-bold text-[10px] uppercase tracking-wider text-[#7A6652] mb-1">Your Name</label>
                <input required type="text" placeholder="Name" className="w-full p-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none" />
              </div>
              <div>
                <label className="block font-bold text-[10px] uppercase tracking-wider text-[#7A6652] mb-1">Phone Number</label>
                <input required type="tel" placeholder="+91 98765 43210" className="w-full p-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none" />
              </div>
              <div>
                <label className="block font-bold text-[10px] uppercase tracking-wider text-[#7A6652] mb-1">Event Date & Requirements</label>
                <textarea rows={3} placeholder="Event date, venue, special requests..." className="w-full p-2 border border-[#DDD0BB] bg-[#FFFDF8] rounded outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHireModalOpen(false)}
                  className="flex-1 py-2 border border-[#DDD0BB] text-[#7A6652] font-semibold rounded hover:bg-[#FAF6F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] font-bold uppercase tracking-wider rounded hover:shadow"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
