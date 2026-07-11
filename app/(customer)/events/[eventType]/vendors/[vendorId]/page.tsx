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

  // Check if vendor is already saved on mount
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
      .maybeSingle();

    setIsSaved(!!data);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handler functions
  const handleContactVendor = () => {
    // Default phone call action
    const phone = '+919876543210'; // Default demo number
    window.location.href = `tel:${phone}`;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl font-semibold text-white transition-all animate-pulse ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/events/${eventType}/vendors`}
          className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Vendors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                {/* Vendor Icon */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 flex-shrink-0">
                  <div className="text-8xl">{vendor.image}</div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {vendor.name}
                      </h1>
                      <div className="flex items-center gap-3">
                        <span className="inline-block bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full font-semibold">
                          {vendor.category}
                        </span>
                        {vendor.verified && (
                          <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                            ✓ Verified Vendor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.floor(vendor.rating) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {vendor.rating}
                    </span>
                    <span className="text-gray-600">
                      ({vendor.reviews} reviews)
                    </span>
                  </div>

                  {/* Location & Price */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">📍</span>
                      <span className="font-medium">{vendor.location}, {vendor.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {vendor.priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {vendor.description}
              </p>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vendor.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-50 rounded-lg p-4 border-2 border-purple-100 hover:border-purple-300 transition-colors"
                  >
                    <div className="text-3xl mb-2">✓</div>
                    <div className="font-semibold text-gray-900">{service}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio/Work Samples */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioImages.map((emoji, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-6xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Sample portfolio images - Real vendor portfolios will be added in production
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {sampleReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{review.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
              
              <button 
                onClick={() => setShowHireModal(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mb-3 text-lg"
              >
                🤝 Hire This Vendor
              </button>
              
              <button 
                onClick={handleContactVendor}
                className="w-full py-4 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all mb-3 text-lg"
              >
                📞 Call: +91 98765 43210
              </button>
              

              
              <button 
                onClick={handleSaveVendor}
                disabled={isSaving}
                className={`w-full py-4 ${
                  isSaved 
                    ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } border-2 font-bold rounded-lg transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSaving ? '⏳ Saving...' : isSaved ? '✓ Saved' : '🔖 Save Vendor'}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Typically responds within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Verified business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>{vendor.reviews}+ completed bookings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">{vendor.reviews}+</div>
                  <div className="text-sm opacity-90">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{vendor.rating}★</div>
                  <div className="text-sm opacity-90">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{vendor.verified ? '100%' : '95%'}</div>
                  <div className="text-sm opacity-90">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Hire Vendor Modal */}
        {showHireModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">🤝 Hire {vendor.name}</h2>
                  <p className="text-sm opacity-90">Send your requirements and get a personalized quote</p>
                </div>
                <button
                  onClick={() => setShowHireModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {leadCreated ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-3xl font-bold text-green-600 mb-2">Success!</h3>
                  <p className="text-xl text-gray-700 mb-4">
                    We've sent your inquiry to {vendor.name}
                  </p>
                  <p className="text-gray-600">
                    The vendor will review your requirements and respond within 24-48 hours. 
                    You can track the status in your dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleHireVendor(); }} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto px-2">
                    {/* Customer Information */}
                    <div className="md:col-span-2 bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">👤</span> Your Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={hireForm.customerName}
                            onChange={(e) => setHireForm({...hireForm, customerName: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={hireForm.customerEmail}
                            onChange={(e) => setHireForm({...hireForm, customerEmail: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={hireForm.customerPhone}
                            onChange={(e) => setHireForm({...hireForm, customerPhone: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Event Information */}
                    <div className="md:col-span-2 bg-pink-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">🎉</span> Event Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Name
                          </label>
                          <input
                            type="text"
                            value={hireForm.eventName}
                            onChange={(e) => setHireForm({...hireForm, eventName: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Birthday Party, Wedding"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Date
                          </label>
                          <input
                            type="date"
                            value={hireForm.eventDate}
                            onChange={(e) => setHireForm({...hireForm, eventDate: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={hireForm.eventLocation}
                            onChange={(e) => setHireForm({...hireForm, eventLocation: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="City, State"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Venue
                          </label>
                          <input
                            type="text"
                            value={hireForm.eventVenue}
                            onChange={(e) => setHireForm({...hireForm, eventVenue: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Venue name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Guests
                          </label>
                          <input
                            type="number"
                            value={hireForm.guestCount}
                            onChange={(e) => setHireForm({...hireForm, guestCount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">💰</span> Budget Range
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Budget (₹)
                          </label>
                          <input
                            type="number"
                            value={hireForm.budgetMin}
                            onChange={(e) => setHireForm({...hireForm, budgetMin: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="25000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Budget (₹)
                          </label>
                          <input
                            type="number"
                            value={hireForm.budgetMax}
                            onChange={(e) => setHireForm({...hireForm, budgetMax: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="50000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Details
                      </label>
                      <textarea
                        value={hireForm.serviceDetails}
                        onChange={(e) => setHireForm({...hireForm, serviceDetails: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="What specific services do you need?"
                      />
                    </div>

                    {/* Specific Requirements */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Requirements
                      </label>
                      <textarea
                        value={hireForm.specificRequirements}
                        onChange={(e) => setHireForm({...hireForm, specificRequirements: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Any special requirements, preferences, or constraints?"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6 pt-6 border-t">
                    <button
                      type="submit"
                      disabled={isCreatingLead}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isCreatingLead ? '📤 Sending...' : '📤 Send Inquiry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHireModal(false)}
                      className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all text-lg"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    * The vendor will receive your inquiry via email and respond within 24-48 hours
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
