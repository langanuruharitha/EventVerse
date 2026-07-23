'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_VENDORS } from '@/lib/data/vendors';
import { notFound } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

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

export default function VendorProfilePage({ 
  params 
}: { 
  params: Promise<{ eventType: string; vendorId: string }> 
}) {
  const toast = useToast();
  const { eventType, vendorId } = use(params);
  const eventTypeInfo = EVENT_TYPES_MAP[eventType] || { name: 'Event', icon: '🎉' };
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showHireModal, setShowHireModal] = useState(false);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);
  
  const [hireForm, setHireForm] = useState({
    eventName: '',
    eventDate: '',
    eventLocation: '',
    eventVenue: '',
    guestCount: '',
    serviceDetails: '',
    specificRequirements: '',
    budgetMin: '',
    budgetMax: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  
  const vendor = SAMPLE_VENDORS.find(v => v.id === vendorId);
  
  if (!vendor) {
    notFound();
  }

  useEffect(() => {
    checkIfSaved();
  }, [vendorId]);

  const checkIfSaved = async () => {
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data } = await supabase
      .from('saved_vendors')
      .select('id')
      .eq('user_id', user.id)
      .eq('vendor_id', vendorId)
      .single();

    setIsSaved(!!data);
  };

  const handleContactVendor = () => {
    const phone = '+919876543210';
    window.location.href = `tel:${phone}`;
  };

  const handleSaveVendor = async () => {
    if (isSaving) return;
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast('Please sign in to save vendors', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_vendors')
          .delete()
          .eq('user_id', user.id)
          .eq('vendor_id', vendorId);

        if (error) throw error;
        
        setIsSaved(false);
        toast('Vendor removed from saved list!', 'info');
      } else {
        const { error } = await supabase
          .from('saved_vendors')
          .insert({
            user_id: user.id,
            vendor_id: vendorId,
            vendor_name: vendor!.name,
            vendor_category: vendor!.category,
            vendor_image: vendor!.image,
            vendor_rating: vendor!.rating,
            vendor_price_range: vendor!.priceRange,
            vendor_location: vendor!.location,
          });

        if (error) throw error;
        
        setIsSaved(true);
        toast('Vendor saved! View in Dashboard.', 'success');
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast('Failed to save vendor. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHireVendor = async () => {
    if (!hireForm.customerName || !hireForm.customerEmail) {
      toast('Please fill in your name and email', 'warning');
      return;
    }

    setIsCreatingLead(true);

    try {
      const response = await fetch('/api/vendor-leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendorId,
          eventId: null,
          eventType: eventType,
          eventName: hireForm.eventName,
          eventDate: hireForm.eventDate,
          eventLocation: hireForm.eventLocation,
          eventVenue: hireForm.eventVenue,
          guestCount: hireForm.guestCount ? parseInt(hireForm.guestCount) : null,
          serviceCategory: vendor.category,
          serviceDetails: hireForm.serviceDetails,
          specificRequirements: hireForm.specificRequirements,
          budgetMin: hireForm.budgetMin ? parseFloat(hireForm.budgetMin) : null,
          budgetMax: hireForm.budgetMax ? parseFloat(hireForm.budgetMax) : null,
          budgetFlexible: true,
          customerName: hireForm.customerName,
          customerEmail: hireForm.customerEmail,
          customerPhone: hireForm.customerPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLeadCreated(true);
        setTimeout(() => {
          setShowHireModal(false);
          setLeadCreated(false);
        }, 3000);
      } else {
        toast(data.error || 'Failed to create lead', 'error');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast('Failed to contact vendor. Please try again.', 'error');
    } finally {
      setIsCreatingLead(false);
    }
  };

  const generateAIEmail = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiSubject = `Inquiry about ${vendor.category} services for upcoming event`;
    const aiMessage = `Dear ${vendor.name} Team,

I hope this email finds you well. I am planning an event and came across your services on EventVerse.

I am interested in learning more about your ${vendor.category} services, particularly:
- Available packages and pricing
- Availability for my event date
- Customization options
- Previous work samples

Your ratings and reviews are impressive (${vendor.rating}★ with ${vendor.reviews}+ happy clients), and I would love to discuss how we can work together.

Could you please share more details about your services and availability?

Looking forward to hearing from you soon.

Best regards`;

    setEmailSubject(aiSubject);
    setEmailMessage(aiMessage);
    setIsGenerating(false);
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      toast('Please fill in subject and message', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/vendor-inquiries/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendorId,
          subject: emailSubject,
          message: emailMessage,
          eventType: eventType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast('Message sent successfully! The vendor will see it in their portal.', 'success');
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailMessage('');
      } else {
        toast(data.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const portfolioImages = ['📸', '🎨', '🎭', '🎪', '🎬', '🎤'];

  const sampleReviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2 weeks ago',
      comment: `Excellent service! ${vendor.name} exceeded our expectations. Professional team, on-time delivery, and amazing quality. Highly recommended!`
    },
    {
      id: 2,
      name: 'Rahul Verma',
      rating: 5,
      date: '1 month ago',
      comment: `Very satisfied with their work. Attention to detail was impressive. Worth every penny spent. Will definitely hire again for future events.`
    },
    {
      id: 3,
      name: 'Anjali Patel',
      rating: 4,
      date: '2 months ago',
      comment: `Good experience overall. Professional approach and quality service. Minor delay in delivery but the final result was great. Recommended!`
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href={`/events/${eventType}/vendors`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans mb-6"
        >
          ← Back to Vendors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Vendor Header */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
              <div className="flex items-start gap-5">
                {/* Vendor Icon */}
                <div className="bg-[#EDE0CC] rounded border border-[#DDD0BB] p-5 flex-shrink-0">
                  <div className="text-6xl">{vendor.image}</div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h1 className="text-xl font-bold text-[#2C1810] mb-1.5">
                      {vendor.name}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block bg-[#8A1C2C]/10 border border-[#8A1C2C]/20 text-[#8A1C2C] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-sans">
                        {vendor.category}
                      </span>
                      {vendor.verified && (
                        <span className="inline-block bg-green-500/10 border border-green-500/20 text-green-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-sans">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(vendor.rating) ? 'text-yellow-500 text-sm' : 'text-[#DDD0BB] text-sm'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-sm text-[#1F1E1B] font-sans">{vendor.rating}</span>
                    <span className="text-[10px] text-[#1F1E1B]/50 font-sans">({vendor.reviews} reviews)</span>
                  </div>

                  {/* Location & Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#1F1E1B]/60 font-sans">
                      <span>📍</span>
                      <span>{vendor.location}, {vendor.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>💰</span>
                      <span className="text-lg font-bold text-[#8A1C2C] font-sans">{vendor.priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h2 className="text-sm font-bold text-[#2C1810]">About Us</h2>
              </div>
              <p className="p-5 text-xs text-[#1F1E1B]/70 italic leading-relaxed">{vendor.description}</p>
            </div>

            {/* Services Section */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h2 className="text-sm font-bold text-[#2C1810]">Our Services</h2>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                {vendor.services.map((service, idx) => (
                  <div key={idx} className="bg-[#FAF6F0] border border-[#DDD0BB] rounded p-3 hover:border-[#8A1C2C]/30 transition-colors">
                    <div className="text-[#C5A880] font-bold text-sm mb-1">✦</div>
                    <div className="text-xs font-semibold text-[#1F1E1B]">{service}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio/Work Samples */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h2 className="text-sm font-bold text-[#2C1810]">Portfolio</h2>
              </div>
              <div className="p-5 grid grid-cols-3 gap-3">
                {portfolioImages.map((emoji, idx) => (
                  <div key={idx} className="aspect-square bg-[#EDE0CC] border border-[#DDD0BB] rounded flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer">
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#1F1E1B]/40 italic text-center pb-4 font-sans">
                Sample portfolio — Real vendor portfolios will be available in production
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h2 className="text-sm font-bold text-[#2C1810]">Customer Reviews</h2>
              </div>
              <div className="divide-y divide-[#FAF6F0] p-5 space-y-4">
                {sampleReviews.map((review) => (
                  <div key={review.id} className="pt-4 first:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm text-[#1F1E1B]">{review.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-500 text-xs' : 'text-[#DDD0BB] text-xs'}>⭐</span>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#1F1E1B]/40 font-sans">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#1F1E1B]/60 italic leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact Card */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-5 sticky top-6 space-y-3">
              <h3 className="text-sm font-bold text-[#2C1810] pb-3 border-b border-[#FAF6F0]">Get in Touch</h3>

              <button
                onClick={() => setShowHireModal(true)}
                className="w-full py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6A1420] text-white font-sans font-bold text-xs uppercase tracking-wider rounded shadow hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>🤝</span>
                <span>Hire Vendor</span>
              </button>

              <button
                onClick={() => {
                  generateAIEmail();
                  setShowEmailModal(true);
                }}
                className="w-full py-2.5 bg-[#FAF6F0] border border-[#C5A880] text-[#8A1C2C] font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-[#F5EDE0] transition-colors flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Send AI Inquiry</span>
              </button>

              <button
                onClick={handleSaveVendor}
                disabled={isSaving}
                className={`w-full py-2.5 border font-sans font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 ${
                  isSaved 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : 'bg-white border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
                }`}
              >
                <span>{isSaved ? '❤️' : '🤍'}</span>
                <span>{isSaved ? 'Saved in List' : 'Save Vendor'}</span>
              </button>

              <div className="pt-3 border-t border-[#FAF6F0] space-y-2 text-xs text-[#1F1E1B]/60 font-sans">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-[#1F1E1B] capitalize">{vendor.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="font-semibold text-[#8A1C2C]">{vendor.priceRange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-[#1F1E1B]">{vendor.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
