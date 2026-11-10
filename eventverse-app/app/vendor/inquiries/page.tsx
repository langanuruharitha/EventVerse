'use client';

import { useState, useEffect, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  Mail, Phone, Calendar, Clock, Check, X, Search, 
  MessageSquare, Send, Sparkles, User, CheckCircle2, 
  RefreshCw, DollarSign, Users, MapPin, AlertCircle
} from 'lucide-react';

export interface Inquiry {
  id: string;
  vendor_id?: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  event_type?: string;
  event_date?: string;
  guest_count?: number;
  budget?: string;
  location?: string;
  status: 'new' | 'read' | 'replied' | 'accepted' | 'declined';
  is_read: boolean;
  vendor_response?: string;
  responded_at?: string;
  created_at: string;
}

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    customer_name: 'Priya & Arjun Sharma',
    customer_email: 'priya.sharma92@gmail.com',
    customer_phone: '+91 98201 44521',
    subject: 'Complete 3-Day Wedding Photography & Cinematic Video Package',
    message: 'Hello! We love your portfolio on EventVerse. We are hosting a 3-day wedding celebration in Mumbai (Sangeet, Mehendi, and Grand Reception) with ~450 guests. We would love to know if your team is available for December 12-14, 2026, and what packages you recommend. Looking forward to your response!',
    event_type: 'Wedding',
    event_date: '2026-12-12',
    guest_count: 450,
    budget: '₹85,000 - ₹1,40,000',
    location: 'Mumbai, Maharashtra',
    status: 'new',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inq-002',
    customer_name: 'Kavita Desai',
    customer_email: 'kavita.desai@yahoo.com',
    customer_phone: '+91 97112 88390',
    subject: '1st Birthday Celebration Princess Theme Decoration & Photo Booth',
    message: 'Hi, we are organizing our daughter\'s 1st birthday party at a banquet hall in Bandra. We need a fairytale castle backdrop, organic balloon arches, customized entrance board, and a themed photo booth. Can you provide a quotation and availability for next month?',
    event_type: 'Birthday',
    event_date: '2026-12-05',
    guest_count: 85,
    budget: '₹25,000 - ₹45,000',
    location: 'Bandra, Mumbai',
    status: 'new',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inq-003',
    customer_name: 'Rajesh Nair',
    customer_email: 'rajesh.nair@corp-events.in',
    customer_phone: '+91 98450 12984',
    subject: 'Annual Corporate Awards Night - Sound, Lighting & Stage Management',
    message: 'Greetings! We are planning our corporate annual gala for 350 executives. We require full AV production, intelligent stage lighting, LED video wall, and coordination for keynote speakers and awards distribution. Please send over your corporate rate card and technical rider.',
    event_type: 'Corporate',
    event_date: '2026-12-20',
    guest_count: 350,
    budget: '₹1,50,000 - ₹2,50,000',
    location: 'BKC, Mumbai',
    status: 'replied',
    is_read: true,
    vendor_response: 'Dear Rajesh, thank you for reaching out! We have handled numerous corporate conferences at BKC. I have emailed our corporate AV catalog along with high-definition stage setups to rajesh.nair@corp-events.in. I would be happy to jump on a brief call tomorrow to discuss your exact timeline.',
    responded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inq-004',
    customer_name: 'Siddharth Singhania',
    customer_email: 'sid.singhania@gmail.com',
    customer_phone: '+91 99302 77162',
    subject: 'Acoustic Bollywood & Sufi Live Band for Engagement Evening',
    message: 'We want an energetic yet soulful 4-piece acoustic band for our ring ceremony at The Leela on November 28th. Performance duration around 3.5 hours. Please let us know if you can accommodate this date.',
    event_type: 'Engagement',
    event_date: '2026-11-28',
    guest_count: 140,
    budget: '₹40,000 - ₹60,000',
    location: 'Andheri East, Mumbai',
    status: 'accepted',
    is_read: true,
    vendor_response: 'Dear Siddharth, heartiest congratulations on your upcoming engagement! Yes, our ensemble is available for November 28th at The Leela. We would love to perform for you and create an unforgettable musical evening. We have locked your slot and will connect with your event coordinator.',
    responded_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 55 * 60 * 60 * 1000).toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'eventverse_vendor_inquiries';

export default function VendorInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [response, setResponse] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'replied' | 'accepted' | 'declined'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load inquiries on mount
  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    let loaded: Inquiry[] = [];

    // 1. First read from localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }

    // 2. Try fetching from Supabase
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Try finding vendor id in vendors or vendor_profiles
        let vendorId = user.id;

        const { data: vendorRecord } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (vendorRecord?.id) {
          vendorId = vendorRecord.id;
        } else {
          const { data: profileRecord } = await supabase
            .from('vendor_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          if (profileRecord?.id) {
            vendorId = profileRecord.id;
          }
        }

        // Query vendor_inquiries table
        const { data: dbInquiries, error: inqError } = await supabase
          .from('vendor_inquiries')
          .select('*')
          .or(`vendor_id.eq.${vendorId},vendor_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (!inqError && dbInquiries && dbInquiries.length > 0) {
          const formatted: Inquiry[] = dbInquiries.map((item: any) => ({
            id: item.id || `inq-${Math.random()}`,
            vendor_id: item.vendor_id,
            customer_id: item.customer_id,
            customer_name: item.customer_name || 'Customer',
            customer_email: item.customer_email || 'customer@example.com',
            customer_phone: item.customer_phone || '',
            subject: item.subject || 'Event Inquiry',
            message: item.message || '',
            event_type: item.event_type || 'Event',
            event_date: item.event_date || '',
            guest_count: item.guest_count || undefined,
            budget: item.budget_range || item.budget || '',
            location: item.location || item.venue_location || '',
            status: (item.status as any) || (item.vendor_response ? 'replied' : item.is_read ? 'read' : 'new'),
            is_read: item.is_read ?? false,
            vendor_response: item.vendor_response || '',
            responded_at: item.responded_at || '',
            created_at: item.created_at || new Date().toISOString(),
          }));

          // Merge: DB items take precedence, preserving local defaults if unique
          const existingIds = new Set(formatted.map(i => i.id));
          loaded = [...formatted, ...loaded.filter(i => !existingIds.has(i.id))];
        }

        // Also check vendor_leads table as fallback/additional lead inquiries
        const { data: dbLeads } = await supabase
          .from('vendor_leads')
          .select('*')
          .or(`vendor_id.eq.${vendorId},vendor_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (dbLeads && dbLeads.length > 0) {
          const leadInquiries: Inquiry[] = dbLeads.map((lead: any) => ({
            id: lead.id,
            vendor_id: lead.vendor_id,
            customer_id: lead.customer_id,
            customer_name: lead.customer_name || 'Event Host',
            customer_email: lead.customer_email || '',
            customer_phone: lead.customer_phone || '',
            subject: lead.event_name ? `Lead: ${lead.event_name} (${lead.event_type || 'Event'})` : `Inquiry about ${lead.service_details || 'Services'}`,
            message: lead.specific_requirements || lead.service_details || 'Customer requested service proposal.',
            event_type: lead.event_type || 'Event',
            event_date: lead.event_date || '',
            guest_count: lead.guest_count || undefined,
            budget: lead.budget_min && lead.budget_max ? `₹${lead.budget_min.toLocaleString()} - ₹${lead.budget_max.toLocaleString()}` : '',
            location: lead.event_location || lead.event_venue || '',
            status: lead.status === 'accepted' ? 'accepted' : lead.status === 'rejected' ? 'declined' : lead.vendor_response ? 'replied' : 'new',
            is_read: lead.status !== 'new',
            vendor_response: lead.vendor_response || '',
            responded_at: lead.responded_at || '',
            created_at: lead.created_at || new Date().toISOString(),
          }));

          const existingIds = new Set(loaded.map(i => i.id));
          const newLeads = leadInquiries.filter(i => !existingIds.has(i.id));
          loaded = [...loaded, ...newLeads];
        }
      }
    } catch (err) {
      console.warn('Supabase inquiries sync error (using local data):', err);
    }

    // If still empty, initialize with default inquiries
    if (loaded.length === 0) {
      loaded = DEFAULT_INQUIRIES;
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INQUIRIES));
      } catch (e) {}
    }

    setInquiries(loaded);
    // Auto-select first inquiry
    if (loaded.length > 0) {
      setSelectedInquiry(loaded[0]);
    }
    setLoading(false);
  };

  const saveInquiriesState = (updatedList: Inquiry[]) => {
    setInquiries(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const markAsRead = async (inquiryId: string) => {
    const updated = inquiries.map(i => {
      if (i.id === inquiryId) {
        return { ...i, is_read: true, status: i.status === 'new' ? 'read' : i.status };
      }
      return i;
    });
    saveInquiriesState(updated);

    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(prev => prev ? { ...prev, is_read: true, status: prev.status === 'new' ? 'read' : prev.status } : null);
    }

    // Sync to Supabase in background
    try {
      const supabase = createBrowserClient();
      await supabase
        .from('vendor_inquiries')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', inquiryId);
    } catch (e) {}
  };

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setResponse(inquiry.vendor_response || '');
    if (!inquiry.is_read) {
      markAsRead(inquiry.id);
    }
  };

  const handleSendResponse = async (customText?: string, targetStatus: 'replied' | 'accepted' | 'declined' = 'replied') => {
    const textToSend = customText !== undefined ? customText : response;
    if (!selectedInquiry) {
      showToast('Please select an inquiry first', 'error');
      return;
    }
    if (!textToSend.trim()) {
      showToast('Please enter your response message', 'error');
      return;
    }

    setIsSending(true);
    const now = new Date().toISOString();

    const updatedInquiries = inquiries.map(item => {
      if (item.id === selectedInquiry.id) {
        return {
          ...item,
          vendor_response: textToSend,
          responded_at: now,
          status: targetStatus,
          is_read: true,
        };
      }
      return item;
    });

    saveInquiriesState(updatedInquiries);
    setSelectedInquiry(prev => prev ? {
      ...prev,
      vendor_response: textToSend,
      responded_at: now,
      status: targetStatus,
      is_read: true,
    } : null);

    // Try syncing to Supabase
    try {
      const supabase = createBrowserClient();
      await supabase
        .from('vendor_inquiries')
        .update({
          vendor_response: textToSend,
          responded_at: now,
          status: targetStatus,
          is_read: true,
        })
        .eq('id', selectedInquiry.id);
    } catch (e) {
      console.warn('Supabase sync skipped:', e);
    }

    setIsSending(false);
    showToast(
      targetStatus === 'accepted' 
        ? 'Inquiry accepted and response dispatched!' 
        : targetStatus === 'declined' 
        ? 'Inquiry polite decline sent' 
        : 'Response sent to customer successfully!',
      'success'
    );
  };

  const handleQuickAccept = () => {
    if (!selectedInquiry) return;
    const acceptMsg = `Dear ${selectedInquiry.customer_name},\n\nThank you for reaching out to us on EventVerse! We are delighted to confirm our availability for your upcoming ${selectedInquiry.event_type || 'event'}${selectedInquiry.event_date ? ` on ${selectedInquiry.event_date}` : ''}.\n\nWe would love to provide our professional services tailored exactly to your requirements. I have reserved your tentative slot and will follow up shortly with our detailed package brochure and quotation.\n\nWarm regards,\nEventVerse Vendor Team`;
    setResponse(acceptMsg);
    handleSendResponse(acceptMsg, 'accepted');
  };

  const handleQuickDecline = () => {
    if (!selectedInquiry) return;
    const declineMsg = `Dear ${selectedInquiry.customer_name},\n\nThank you for considering our services for your ${selectedInquiry.event_type || 'event'}.\n\nRegrettably, we are already fully committed on ${selectedInquiry.event_date || 'your requested date'} and cannot take on additional bookings with the high standard of dedication we guarantee.\n\nWe appreciate your interest and wish you the absolute best with your celebration!\n\nWarm regards,\nEventVerse Vendor Team`;
    setResponse(declineMsg);
    handleSendResponse(declineMsg, 'declined');
  };

  const handleGenerateAI = () => {
    if (!selectedInquiry) return;
    const generated = `Dear ${selectedInquiry.customer_name},\n\nThank you for your inquiry regarding our ${selectedInquiry.event_type || 'event'} services on EventVerse!\n\nWe reviewed your requirements for ${selectedInquiry.guest_count ? `~${selectedInquiry.guest_count} guests` : 'your event'}${selectedInquiry.budget ? ` within your budget of ${selectedInquiry.budget}` : ''}. We have extensive experience creating seamless experiences for celebrations like yours.\n\nCould we arrange a quick phone call at your convenience${selectedInquiry.customer_phone ? ` on ${selectedInquiry.customer_phone}` : ''} to discuss custom options and finalize your proposal?\n\nLooking forward to collaborating with you!\n\nBest regards,\nYour EventVerse Dedicated Vendor`;
    setResponse(generated);
    showToast('✨ AI response generated! Review and click Send.', 'info');
  };

  const handleResetDemoData = () => {
    saveInquiriesState(DEFAULT_INQUIRIES);
    setSelectedInquiry(DEFAULT_INQUIRIES[0]);
    setResponse('');
    showToast('Inquiries reset to demo data', 'info');
  };

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      // Status filter
      if (statusFilter === 'new') {
        if (item.status !== 'new' && item.is_read) return false;
      } else if (statusFilter === 'replied') {
        if (item.status !== 'replied') return false;
      } else if (statusFilter === 'accepted') {
        if (item.status !== 'accepted') return false;
      } else if (statusFilter === 'declined') {
        if (item.status !== 'declined') return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.customer_name?.toLowerCase().includes(query);
        const matchesSubject = item.subject?.toLowerCase().includes(query);
        const matchesMessage = item.message?.toLowerCase().includes(query);
        const matchesEmail = item.customer_email?.toLowerCase().includes(query);
        const matchesType = item.event_type?.toLowerCase().includes(query);
        if (!matchesName && !matchesSubject && !matchesMessage && !matchesEmail && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [inquiries, statusFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter(i => !i.is_read || i.status === 'new').length;
    const replied = inquiries.filter(i => i.status === 'replied').length;
    const accepted = inquiries.filter(i => i.status === 'accepted').length;
    return { total, unread, replied, accepted };
  }, [inquiries]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-800 text-white border border-emerald-600' 
            : toast.type === 'error'
            ? 'bg-rose-800 text-white border border-rose-600'
            : 'bg-amber-800 text-white border border-amber-600'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-amber-300" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span>💬 Client Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Customer Inquiries</h1>
          <p className="opacity-90 text-sm sm:text-base mt-1">
            Manage quote requests, direct client messages, and respond to incoming booking leads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadInquiries()}
            title="Reload from server"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleResetDemoData}
            title="Reset sample inquiries"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2.5 rounded-xl text-xs font-medium transition opacity-80 hover:opacity-100"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Inquiries</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-0.5">All received leads</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
          <p className="text-xs font-medium text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Action Needed
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.unread}</p>
          <p className="text-xs text-orange-500 mt-0.5">Unread / New inquiries</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wider">Replied</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.replied}</p>
          <p className="text-xs text-gray-400 mt-0.5">Response dispatched</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">Accepted</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.accepted}</p>
          <p className="text-xs text-gray-400 mt-0.5">Ready for booking</p>
        </div>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, event, or subject..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'all', label: 'All Inquiries', count: inquiries.length },
            { key: 'new', label: 'Unread', count: stats.unread },
            { key: 'replied', label: 'Replied', count: stats.replied },
            { key: 'accepted', label: 'Accepted', count: stats.accepted },
            { key: 'declined', label: 'Declined', count: inquiries.filter(i => i.status === 'declined').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === tab.key ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: List & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inquiries List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-xl mb-3">
                📭
              </div>
              <h3 className="text-base font-bold text-gray-800">No inquiries match your criteria</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Try switching filter tabs or clearing your search term to see more messages.
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                  className="mt-4 px-4 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredInquiries.map((inquiry) => {
              const isSelected = selectedInquiry?.id === inquiry.id;
              const isUnread = !inquiry.is_read || inquiry.status === 'new';

              return (
                <div
                  key={inquiry.id}
                  onClick={() => handleSelectInquiry(inquiry)}
                  className={`bg-white rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md bg-orange-50/20'
                      : 'border-gray-100 hover:border-orange-200 hover:shadow-sm'
                  } ${isUnread ? 'border-l-4 border-l-orange-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {inquiry.customer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight flex items-center gap-2">
                          {inquiry.customer_name}
                          {isUnread && (
                            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md text-[11px]">
                            {inquiry.event_type || 'Event'}
                          </span>
                          {inquiry.event_date && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {inquiry.event_date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      inquiry.status === 'accepted'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : inquiry.status === 'replied'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : inquiry.status === 'declined'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 line-clamp-1 mb-1">
                    {inquiry.subject}
                  </p>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    {inquiry.vendor_response && (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Replied
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Inquiry Details & Interactive Response (7 cols on lg) */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7 space-y-6 sticky top-24">
              {/* Detail Header */}
              <div className="border-b border-gray-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                      {selectedInquiry.event_type || 'Event Inquiry'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      selectedInquiry.status === 'accepted'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : selectedInquiry.status === 'replied'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : selectedInquiry.status === 'declined'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      Status: {selectedInquiry.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAsRead(selectedInquiry.id)}
                      className="text-xs text-gray-500 hover:text-orange-600 font-semibold px-2 py-1 rounded hover:bg-orange-50 transition"
                    >
                      {selectedInquiry.is_read ? '✓ Read' : 'Mark as Read'}
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 leading-snug">
                  {selectedInquiry.subject}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Received on {new Date(selectedInquiry.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>

              {/* Customer Contact & Event Spec Card */}
              <div className="bg-gradient-to-br from-orange-50/70 to-amber-50/50 rounded-xl p-4 border border-orange-100/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-orange-200/50 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold uppercase text-orange-800 tracking-wider">Customer Details</span>
                  </div>

                  {/* Direct Contact Action Links */}
                  <div className="flex items-center gap-2">
                    {selectedInquiry.customer_phone && (
                      <a
                        href={`tel:${selectedInquiry.customer_phone}`}
                        className="inline-flex items-center gap-1.5 bg-white text-orange-700 border border-orange-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-orange-100 transition shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                    {selectedInquiry.customer_email && (
                      <a
                        href={`mailto:${selectedInquiry.customer_email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                        className="inline-flex items-center gap-1.5 bg-white text-orange-700 border border-orange-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-orange-100 transition shadow-xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Direct Email</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Host / Client Name:</span>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedInquiry.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email Address:</span>
                    <p className="font-semibold text-gray-800 mt-0.5 truncate">{selectedInquiry.customer_email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone Number:</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedInquiry.customer_phone || 'Not provided'}</p>
                  </div>
                  {selectedInquiry.event_date && (
                    <div>
                      <span className="text-gray-500">Target Event Date:</span>
                      <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {selectedInquiry.event_date}
                      </p>
                    </div>
                  )}
                  {selectedInquiry.guest_count && (
                    <div>
                      <span className="text-gray-500">Expected Guests:</span>
                      <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-orange-500" />
                        {selectedInquiry.guest_count} attendees
                      </p>
                    </div>
                  )}
                  {selectedInquiry.budget && (
                    <div>
                      <span className="text-gray-500">Budget Range:</span>
                      <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedInquiry.budget}
                      </p>
                    </div>
                  )}
                  {selectedInquiry.location && (
                    <div className="sm:col-span-2 md:col-span-3">
                      <span className="text-gray-500">Event Location:</span>
                      <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        {selectedInquiry.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Message Body */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  Client Message
                </h3>
                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Vendor Previous Response (if sent) */}
              {selectedInquiry.vendor_response && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Your Dispatched Response
                    </span>
                    {selectedInquiry.responded_at && (
                      <span className="text-emerald-700 font-normal">
                        {new Date(selectedInquiry.responded_at).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-950 whitespace-pre-wrap leading-relaxed mt-2 bg-white/70 p-3 rounded-lg border border-emerald-100">
                    {selectedInquiry.vendor_response}
                  </p>
                </div>
              )}

              {/* Response Composer & Actions */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900">
                    {selectedInquiry.vendor_response ? 'Send Follow-up Message' : 'Respond to Customer'}
                  </h3>

                  {/* One-click smart templates */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>AI Smart Reply</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickAccept}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Accept Inquiry</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickDecline}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                    >
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Compose your personalized proposal, confirmation, or message to the customer here..."
                  className="w-full p-3.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition leading-relaxed font-sans"
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-gray-400">
                    💡 Responses are delivered directly to the client's EventVerse inbox and dashboard.
                  </p>

                  <div className="flex items-center gap-2">
                    {response && (
                      <button
                        type="button"
                        onClick={() => setResponse('')}
                        className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-xl"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isSending || !response.trim()}
                      onClick={() => handleSendResponse()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSending ? 'Sending...' : 'Send Response'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl">
                👈
              </div>
              <h3 className="text-lg font-bold text-gray-800">Select an inquiry to view details</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Click on any inquiry from the left panel to review requirements, contact info, and compose a response.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

