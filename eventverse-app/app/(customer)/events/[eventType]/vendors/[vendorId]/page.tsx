'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_VENDORS } from '@/lib/data/vendors';
import { notFound } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

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
  const { eventType, vendorId } = use(params);
  const eventTypeInfo = EVENT_TYPES_MAP[eventType] || { name: 'Event', icon: '🎉' };
  
  // State for email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // State for hire vendor modal
  const [showHireModal, setShowHireModal] = useState(false);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);
  
  // State for hire form
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
  
  // Find vendor by ID
  const vendor = SAMPLE_VENDORS.find(v => v.id === vendorId);
  
  if (!vendor) {
    notFound();
  }

  // Check if vendor is saved on mount
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

  // Handler functions
  const handleContactVendor = () => {
    // Default phone call action
    const phone = '+919876543210'; // Default demo number
    window.location.href = `tel:${phone}`;
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveVendor = async () => {
    if (isSaving) return;
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast('Please sign in to save vendors', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        // Unsave: Delete from database
        const { error } = await supabase
          .from('saved_vendors')
          .delete()
          .eq('user_id', user.id)
          .eq('vendor_id', vendorId);

        if (error) throw error;
        
        setIsSaved(false);
        showToast('✅ Vendor removed from saved list!');
      } else {
        // Save: Insert into database with vendor details
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
        showToast('✅ Vendor saved! View in Dashboard.');
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      showToast('❌ Failed to save vendor. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHireVendor = async () => {
    // Validate form
    if (!hireForm.customerName || !hireForm.customerEmail) {
      alert('Please fill in your name and email');
      return;
    }

    setIsCreatingLead(true);

    try {
      const response = await fetch('/api/vendor-leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendorId,
          eventId: null, // Can link to existing event if available
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
        alert('Failed to create lead: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to contact vendor. Please try again.');
    } finally {
      setIsCreatingLead(false);
    }
  };

  const generateAIEmail = async () => {
    setIsGenerating(true);
    // Simulate AI generation
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
      alert('Please fill in subject and message');
      return;
    }

    setIsGenerating(true);

    try {
      // Send inquiry through the system (stored in database)
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
        alert('✅ Message sent successfully! The vendor will see it in their portal.');
        setShowEmailModal(false);
        // Reset form
        setEmailSubject('');
        setEmailMessage('');
      } else {
        alert('Failed to send message: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate sample portfolio images (using emojis as placeholders)
  const portfolioImages = [
    '📸', '🎨', '🎭', '🎪', '🎬', '🎤'
  ];

  // Generate sample reviews
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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-xl text-xs font-bold text-white transition-all font-sans ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
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
                className="w-full py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow-lg transition font-sans"
              >
                🤝 Hire This Vendor
              </button>

              <button
                onClick={handleContactVendor}
                className="w-full py-2.5 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] transition font-sans"
              >
                📞 Call: +91 98765 43210
              </button>

              <button
                onClick={handleSaveVendor}
                disabled={isSaving}
                className={`w-full py-2.5 text-xs font-bold rounded transition font-sans disabled:opacity-60 border ${
                  isSaved
                    ? 'bg-green-500/10 border-green-500/20 text-green-800 hover:bg-green-500/20'
                    : 'border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
                }`}
              >
                {isSaving ? '⏳ Saving...' : isSaved ? '✓ Saved to List' : '🔖 Save Vendor'}
              </button>

              <div className="pt-3 border-t border-[#FAF6F0] space-y-1.5 text-[10px] text-[#1F1E1B]/50 italic font-sans">
                <div className="flex items-center gap-1.5"><span>⚡</span> Responds within 24 hours</div>
                <div className="flex items-center gap-1.5"><span>✓</span> Verified business</div>
                <div className="flex items-center gap-1.5"><span>📋</span> {vendor.reviews}+ completed bookings</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className="rounded border border-[#C5A880]/20 shadow-sm p-5 text-center space-y-4"
              style={{ background: 'linear-gradient(135deg, #1F1E1B 0%, #131211 100%)' }}
            >
              <h3 className="text-xs font-bold text-[#C5A880] uppercase tracking-widest font-sans">Why Choose Us?</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-xl font-bold text-white font-sans">{vendor.reviews}+</div>
                  <div className="text-[9px] text-white/50 uppercase font-sans">Happy Clients</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-sans">{vendor.rating}★</div>
                  <div className="text-[9px] text-white/50 uppercase font-sans">Avg Rating</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-sans">{vendor.verified ? '100%' : '95%'}</div>
                  <div className="text-[9px] text-white/50 uppercase font-sans">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Hire Vendor Modal */}
        {showHireModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white border border-[#DDD0BB] rounded shadow-xl max-w-4xl w-full my-8 font-serif">
              {/* Header */}
              <div className="bg-[#FFFDF8] border-b border-[#DDD0BB] px-6 py-4 rounded-t flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#2C1810]">🤝 Hire {vendor.name}</h2>
                  <p className="text-[10px] text-[#1F1E1B]/50 italic font-sans mt-0.5">Send your requirements and receive a personalised quote</p>
                </div>
                <button
                  onClick={() => setShowHireModal(false)}
                  className="text-[#1F1E1B]/40 hover:text-[#8A1C2C] transition p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {leadCreated ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-lg font-bold text-green-700 mb-2">Inquiry Sent Successfully!</h3>
                  <p className="text-xs text-[#1F1E1B]/60 italic font-sans mb-2">
                    We&apos;ve forwarded your inquiry to {vendor.name}.
                  </p>
                  <p className="text-[10px] text-[#1F1E1B]/40 font-sans">
                    The vendor will respond within 24–48 hours. Track status in your dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleHireVendor(); }} className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                    {/* Customer Information */}
                    <div className="md:col-span-2 bg-[#FAF6F0] border border-[#DDD0BB] p-4 rounded">
                      <h3 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider font-sans mb-3">👤 Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text" required
                            value={hireForm.customerName}
                            onChange={(e) => setHireForm({...hireForm, customerName: e.target.value})}
                            className="w-full px-3 py-1.5 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email" required
                            value={hireForm.customerEmail}
                            onChange={(e) => setHireForm({...hireForm, customerEmail: e.target.value})}
                            className="w-full px-3 py-1.5 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">Phone</label>
                          <input
                            type="tel"
                            value={hireForm.customerPhone}
                            onChange={(e) => setHireForm({...hireForm, customerPhone: e.target.value})}
                            className="w-full px-3 py-1.5 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Event Information */}
                    <div className="md:col-span-2 bg-[#FAF6F0] border border-[#DDD0BB] p-4 rounded">
                      <h3 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider font-sans mb-3">🎉 Event Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[{label:'Event Name',key:'eventName',type:'text',ph:'e.g., Birthday Party, Wedding'},
                          {label:'Event Date',key:'eventDate',type:'date',ph:''},
                          {label:'Location',key:'eventLocation',type:'text',ph:'City, State'},
                          {label:'Venue',key:'eventVenue',type:'text',ph:'Venue name'},
                          {label:'No. of Guests',key:'guestCount',type:'number',ph:'100'}].map(({label,key,type,ph}) => (
                          <div key={key}>
                            <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">{label}</label>
                            <input
                              type={type}
                              value={(hireForm as any)[key]}
                              onChange={(e) => setHireForm({...hireForm, [key]: e.target.value})}
                              className="w-full px-3 py-1.5 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans"
                              placeholder={ph}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div className="md:col-span-2">
                      <h3 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider font-sans mb-3">💰 Budget Range (₹)</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">Minimum</label>
                          <input type="number" value={hireForm.budgetMin} onChange={(e) => setHireForm({...hireForm, budgetMin: e.target.value})}
                            className="w-full px-3 py-1.5 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans" placeholder="25000" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">Maximum</label>
                          <input type="number" value={hireForm.budgetMax} onChange={(e) => setHireForm({...hireForm, budgetMax: e.target.value})}
                            className="w-full px-3 py-1.5 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans" placeholder="50000" />
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">Service Details</label>
                      <textarea value={hireForm.serviceDetails} onChange={(e) => setHireForm({...hireForm, serviceDetails: e.target.value})}
                        rows={3} className="w-full px-3 py-2 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans"
                        placeholder="What specific services do you need?" />
                    </div>

                    {/* Specific Requirements */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-[#1F1E1B]/60 uppercase tracking-wider font-sans mb-1">Specific Requirements</label>
                      <textarea value={hireForm.specificRequirements} onChange={(e) => setHireForm({...hireForm, specificRequirements: e.target.value})}
                        rows={3} className="w-full px-3 py-2 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-white font-sans"
                        placeholder="Any special requirements, preferences, or constraints?" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5 pt-4 border-t border-[#FAF6F0]">
                    <button type="submit" disabled={isCreatingLead}
                      className="flex-1 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] py-2.5 rounded text-xs font-bold hover:shadow transition disabled:opacity-50 font-sans"
                    >
                      {isCreatingLead ? '📤 Sending...' : '📤 Send Inquiry'}
                    </button>
                    <button type="button" onClick={() => setShowHireModal(false)}
                      className="px-5 py-2.5 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] transition font-sans"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-[9px] text-[#1F1E1B]/40 italic text-center mt-3 font-sans">
                    The vendor will receive your inquiry and respond within 24–48 hours
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
