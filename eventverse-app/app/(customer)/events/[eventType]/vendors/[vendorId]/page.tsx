'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { SAMPLE_VENDORS } from '@/lib/data/vendors';
import { notFound } from 'next/navigation';

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
  
  // Find vendor by ID
  const vendor = SAMPLE_VENDORS.find(v => v.id === vendorId);
  
  if (!vendor) {
    notFound();
  }

  // Handler functions
  const handleContactVendor = () => {
    // Default phone call action
    const phone = '+919876543210'; // Default demo number
    window.location.href = `tel:${phone}`;
  };

  const handleSaveVendor = () => {
    setIsSaved(!isSaved);
    // TODO: Save to database
    alert(isSaved ? 'Vendor removed from saved list!' : 'Vendor saved successfully!');
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

  const handleSendEmail = () => {
    // Simulate email sending
    const mailto = `mailto:vendor@${vendor.name.toLowerCase().replace(/ /g, '')}.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;
    window.location.href = mailto;
    setShowEmailModal(false);
    alert('Opening your email client...');
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
                onClick={handleContactVendor}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mb-3 text-lg"
              >
                📞 Contact: +91 98765 43210
              </button>
              
              <button 
                onClick={() => setShowEmailModal(true)}
                className="w-full py-4 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all mb-3 text-lg"
              >
                ✉️ Send Email (AI Powered)
              </button>
              
              <button 
                onClick={handleSaveVendor}
                className={`w-full py-4 ${
                  isSaved 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                } border-2 font-bold rounded-lg hover:bg-gray-50 transition-all text-lg`}
              >
                {isSaved ? '✓ Saved' : '🔖 Save Vendor'}
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

        {/* AI Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">✉️ Send Email to {vendor.name}</h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* AI Generate Button */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">🤖 AI Email Assistant</h3>
                      <p className="text-sm text-gray-600">Let AI draft a professional email for you</p>
                    </div>
                    <button
                      onClick={generateAIEmail}
                      disabled={isGenerating}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? '✨ Generating...' : '✨ Generate Email'}
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={12}
                    placeholder="Write your message here or use AI to generate..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={handleSendEmail}
                    disabled={!emailSubject || !emailMessage}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📧 Send Email
                  </button>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  * This will open your default email client with the pre-filled message
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
