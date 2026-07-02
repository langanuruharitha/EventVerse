'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Inquiry {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subject: string;
  message: string;
  event_type: string;
  status: string;
  is_read: boolean;
  vendor_response: string;
  responded_at: string;
  created_at: string;
}

export default function VendorInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [response, setResponse] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in');
        return;
      }

      // Get vendor profile
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!vendor) {
        alert('Vendor profile not found');
        return;
      }

      // Get all inquiries for this vendor
      const { data, error } = await supabase
        .from('vendor_inquiries')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading inquiries:', error);
        alert('Failed to load inquiries');
      } else {
        setInquiries(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (inquiryId: string) => {
    const supabase = createClient();
    await supabase
      .from('vendor_inquiries')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', inquiryId);
    
    loadInquiries();
  };

  const handleRespond = async () => {
    if (!selectedInquiry || !response) {
      alert('Please enter a response');
      return;
    }

    setIsSending(true);
    try {
      const supabase = createClient();
      
      await supabase
        .from('vendor_inquiries')
        .update({
          vendor_response: response,
          responded_at: new Date().toISOString(),
          status: 'replied',
        })
        .eq('id', selectedInquiry.id);

      alert('Response sent successfully!');
      setResponse('');
      setSelectedInquiry(null);
      loadInquiries();
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-2xl">Loading inquiries...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📬 Customer Inquiries</h1>
          <p className="text-gray-600">
            You have <strong className="text-purple-600">{inquiries.filter(i => !i.is_read).length}</strong> unread inquiries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-1 space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No inquiries yet</h3>
                <p className="text-gray-600">Customer inquiries will appear here</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    if (!inquiry.is_read) markAsRead(inquiry.id);
                  }}
                  className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all hover:shadow-xl ${
                    selectedInquiry?.id === inquiry.id ? 'ring-2 ring-purple-500' : ''
                  } ${!inquiry.is_read ? 'border-l-4 border-purple-500' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {inquiry.customer_name}
                      </h3>
                      <p className="text-sm text-gray-500">{inquiry.event_type}</p>
                    </div>
                    {!inquiry.is_read && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 font-semibold line-clamp-2 mb-2">
                    {inquiry.subject}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                    {inquiry.responded_at && (
                      <span className="text-green-600 font-semibold">✓ Replied</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Inquiry Details */}
          <div className="lg:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="border-b pb-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedInquiry.subject}
                    </h2>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedInquiry.status === 'new' ? 'bg-purple-100 text-purple-700' :
                      selectedInquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedInquiry.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                    <h3 className="font-bold text-gray-900 mb-3">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="font-semibold text-gray-900">{selectedInquiry.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-semibold text-gray-900">{selectedInquiry.customer_email}</p>
                      </div>
                      {selectedInquiry.customer_phone && (
                        <div>
                          <span className="text-sm text-gray-600">Phone:</span>
                          <p className="font-semibold text-gray-900">{selectedInquiry.customer_phone}</p>
                        </div>
                      )}
                      {selectedInquiry.event_type && (
                        <div>
                          <span className="text-sm text-gray-600">Event Type:</span>
                          <p className="font-semibold text-gray-900 capitalize">{selectedInquiry.event_type}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Received on {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Previous Response (if exists) */}
                {selectedInquiry.vendor_response && (
                  <div className="mb-6 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">✓</span> Your Response
                    </h3>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {selectedInquiry.vendor_response}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Sent on {new Date(selectedInquiry.responded_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Response Form */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">
                    {selectedInquiry.vendor_response ? 'Send Another Response' : 'Respond to Inquiry'}
                  </h3>
                  
                  {/* Accept/Decline Buttons (if not yet responded) */}
                  {!selectedInquiry.vendor_response && (
                    <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => {
                          setResponse(`Dear ${selectedInquiry.customer_name},\n\nThank you for your inquiry! I would be delighted to assist you with your ${selectedInquiry.event_type}.\n\nI am available on your requested date and can provide comprehensive services. Let me share more details about our packages and pricing.\n\nLooking forward to working with you!\n\nBest regards`);
                        }}
                        className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        ✓ Accept Inquiry
                      </button>
                      <button
                        onClick={() => {
                          setResponse(`Dear ${selectedInquiry.customer_name},\n\nThank you for your interest in our services.\n\nUnfortunately, we are not available for your requested date, or your requirements don't align with our current offerings.\n\nWe appreciate your understanding and wish you the best in finding the perfect service provider for your ${selectedInquiry.event_type}.\n\nBest regards`);
                        }}
                        className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        ✗ Decline Inquiry
                      </button>
                    </div>
                  )}
                  
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={6}
                    placeholder="Type your response here... or use Accept/Decline buttons above"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleRespond}
                      disabled={isSending || !response}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? '📤 Sending...' : '📤 Send Response'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInquiry(null);
                        setResponse('');
                      }}
                      className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select an inquiry
                </h3>
                <p className="text-gray-600">
                  Click on an inquiry from the list to view details and respond
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
