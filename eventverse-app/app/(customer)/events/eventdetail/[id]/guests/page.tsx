'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import GuestForm from '@/components/guests/GuestForm';
import SendInvitationModal from '@/components/guests/SendInvitationModal';
import BulkSendInvitationModal from '@/components/guests/BulkSendInvitationModal';
import Link from 'next/link';
import {
  Plus, Search, Download, Upload, Mail, Phone,
  CheckCircle, Users, Send, Trash2
} from 'lucide-react';

interface Guest {
  id: string;
  guest_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  category: string;
  rsvp_status: string;
  attendance_status: string;
  plus_ones_allowed: number;
  plus_ones_confirmed: number;
  dietary_restrictions: string | null;
  invitation_sent: boolean;
  created_at: string;
}

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  event_type: string;
}

export default function GuestListPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showBulkInvite, setShowBulkInvite] = useState(false);
  const [selectedGuestForInvite, setSelectedGuestForInvite] = useState<Guest | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const supabase = createBrowserClient();

  const handleExportGuests = () => {
    if (guests.length === 0) return;
    const headers = ['Name','Email','Phone','City','Category','RSVP Status','Plus Ones Allowed','Plus Ones Confirmed','Dietary Restrictions'];
    const csvRows = guests.map(guest => [
      `"${guest.guest_name || ''}"`, `"${guest.email || ''}"`, `"${guest.phone || ''}"`,
      `"${guest.city || ''}"`, `"${guest.category || 'general'}"`, `"${guest.rsvp_status || 'pending'}"`,
      guest.plus_ones_allowed || 0, guest.plus_ones_confirmed || 0, `"${guest.dietary_restrictions || ''}"`
    ].join(','));
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event?.event_name || 'event'}_guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportGuests = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) throw new Error('CSV file is empty or only contains headers.');
        const newGuests = lines.slice(1).map(line => {
          const values = line.match(/(\".*?\"|[^\",]+)(?=\s*,|\s*$)/g) || line.split(',');
          const cleanVals = values.map(v => v.replace(/^\"|\"$/g, '').trim());
          return {
            event_id: eventId, user_id: user.id,
            guest_name: cleanVals[0] || 'Unknown', email: cleanVals[1] || null,
            phone: cleanVals[2] || null, city: cleanVals[3] || null,
            category: cleanVals[4] || 'general', rsvp_status: cleanVals[5] || 'pending',
            plus_ones_allowed: parseInt(cleanVals[6]) || 0,
            plus_ones_confirmed: parseInt(cleanVals[7]) || 0,
            dietary_restrictions: cleanVals[8] || null, invitation_sent: false
          };
        });
        const { error } = await supabase.from('guests').insert(newGuests);
        if (error) throw error;
        alert(`Successfully imported ${newGuests.length} guests!`);
        await fetchEventAndGuests();
      } catch (err) {
        console.error('Error importing guests:', err);
        alert('Failed to import guests. Please check the CSV format.');
        setLoading(false);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => { fetchEventAndGuests(); }, [eventId]);

  const fetchEventAndGuests = async () => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/signin'); return; }
      const { data: eventData, error: eventError } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (eventError) throw eventError;
      setEvent(eventData);
      const response = await fetch(`/api/guests?event_id=${eventId}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error?.includes('column') ? 'database_setup' : 'fetch_failed');
        setGuests([]);
      } else {
        const data = await response.json();
        setGuests(data.guests || []);
      }
    } catch (error: any) {
      setError(error.message?.includes('column') ? 'database_setup' : 'general');
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!window.confirm('Are you sure you want to remove this guest?')) return;
    try {
      const { error } = await supabase.from('guests').delete().eq('id', guestId);
      if (error) throw error;
      setGuests(guests.filter(g => g.id !== guestId));
    } catch (err) {
      alert('Failed to delete guest. Please try again.');
    }
  };

  const getFilteredGuests = () => {
    let filtered = guests;
    if (searchQuery) {
      filtered = filtered.filter(g =>
        g.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone?.includes(searchQuery)
      );
    }
    if (filterStatus !== 'all') filtered = filtered.filter(g => g.rsvp_status === filterStatus);
    return filtered;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-500/10 border-green-500/20 text-green-800',
      pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-800',
      tentative: 'bg-blue-500/10 border-blue-500/20 text-blue-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border font-sans ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length;
  const totalPlusOnes = guests.reduce((sum, g) => sum + g.plus_ones_confirmed, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading guest registry...</p>
        </div>
      </div>
    );
  }

  if (error === 'database_setup') {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-8 font-serif text-[#1F1E1B]">
        <div className="max-w-3xl mx-auto">
          <Link href={`/events/eventdetail/${eventId}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans mb-6">
            ← Back to Event
          </Link>
          <div className="bg-white border-2 border-double border-[#C5A880] rounded shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-xl font-bold text-[#2C1810] mb-3">Database Setup Required</h2>
            <p className="text-xs text-[#1F1E1B]/60 italic mb-6 max-w-lg mx-auto">
              The guest management feature requires additional database columns. This is a one-time setup.
            </p>
            <div className="bg-[#1F1E1B] text-green-400 p-4 rounded font-mono text-xs text-left overflow-x-auto mb-6">
              <pre>{`ALTER TABLE guests ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS city VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_allowed INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_confirmed INT DEFAULT 0;`}</pre>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-semibold rounded hover:shadow font-sans transition"
              >
                ✓ I've Run the SQL — Refresh
              </button>
              <button
                onClick={() => router.push(`/events/eventdetail/${eventId}`)}
                className="px-5 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition"
              >
                Go Back to Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredGuests = getFilteredGuests();

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-4">
          <Link href={`/events/eventdetail/${eventId}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans">
            ← Back to Event
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2C1810]">👥 Guest Registry</h1>
              {event && (
                <p className="text-xs text-[#1F1E1B]/50 italic mt-1 font-sans">
                  {event.event_name} • {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowBulkInvite(true)}
                variant="outline"
                className="border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0] text-xs font-sans"
              >
                <Mail className="w-4 h-4 mr-1.5" /> Send All
              </Button>
              <Button
                onClick={() => setShowGuestForm(true)}
                className="bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-sans hover:shadow"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Guest
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Invited', value: guests.length, icon: <Users className="w-5 h-5 text-[#8A1C2C]" /> },
            { label: 'Confirmed', value: confirmed, icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
            { label: 'Plus Ones', value: totalPlusOnes, icon: <Users className="w-5 h-5 text-[#C5A880]" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-[#DDD0BB] rounded shadow-sm p-4 text-center">
              <div className="flex justify-center mb-1.5">{stat.icon}</div>
              <div className="text-[10px] text-[#1F1E1B]/50 uppercase tracking-wider font-sans mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-[#1F1E1B] font-sans">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DDD0BB] w-4 h-4" />
              <input
                type="text"
                placeholder="Search guests by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-[#FAF6F0] font-sans"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-[#FAF6F0] font-sans text-[#1F1E1B]/70"
              >
                <option value="all">All Guests</option>
                <option value="confirmed">Confirmed</option>
                <option value="tentative">Tentative</option>
                <option value="pending">Pending</option>
              </select>
              <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleImportGuests} />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition">
                <Upload className="w-3.5 h-3.5" /> Import
              </button>
              <button onClick={handleExportGuests} className="flex items-center gap-1.5 px-3 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Guest Table */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#FAF6F0] bg-[#FFFDF8]">
            <h3 className="text-sm font-bold text-[#2C1810]">Guest List ({filteredGuests.length})</h3>
          </div>
          {filteredGuests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#FAF6F0]">
                    {['Name', 'City', 'Contact', 'Category', 'RSVP', 'Plus Ones', 'Invitation', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[9px] font-bold text-[#1F1E1B]/50 uppercase tracking-widest font-sans">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-[#FAF6F0]/70 hover:bg-[#FAF6F0]/50 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#1F1E1B] text-xs">{guest.guest_name}</div>
                        {guest.dietary_restrictions && (
                          <div className="text-[10px] text-[#1F1E1B]/40 italic mt-0.5">🍽️ {guest.dietary_restrictions}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-[#1F1E1B]/60 font-sans">{guest.city || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {guest.email && (
                            <div className="flex items-center gap-1 text-[10px] text-[#1F1E1B]/50 font-sans">
                              <Mail className="w-3 h-3" /> {guest.email}
                            </div>
                          )}
                          {guest.phone && (
                            <div className="flex items-center gap-1 text-[10px] text-[#1F1E1B]/50 font-sans">
                              <Phone className="w-3 h-3" /> {guest.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-[#1F1E1B]/60 capitalize font-sans">{guest.category}</td>
                      <td className="py-3 px-4">{getStatusBadge(guest.rsvp_status)}</td>
                      <td className="py-3 px-4 text-xs text-[#1F1E1B]/60 font-sans">
                        {guest.plus_ones_confirmed} / {guest.plus_ones_allowed}
                      </td>
                      <td className="py-3 px-4">
                        {guest.invitation_sent ? (
                          <span className="text-green-600 text-[10px] font-bold font-sans">✓ Sent</span>
                        ) : (
                          <span className="text-[#1F1E1B]/30 text-[10px] font-sans">Not sent</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5">
                          {!guest.invitation_sent && (
                            <button
                              onClick={() => setSelectedGuestForInvite(guest)}
                              className="flex items-center gap-1 px-2 py-1 border border-[#DDD0BB] text-[#7A6652] hover:border-[#8A1C2C] hover:text-[#8A1C2C] rounded text-[10px] font-semibold font-sans transition"
                            >
                              <Send className="w-3 h-3" /> Send
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-1 border border-[#DDD0BB] text-red-400 hover:text-red-600 hover:border-red-300 rounded transition"
                            title="Remove Guest"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 text-[#DDD0BB] mx-auto mb-4" />
              <p className="text-sm text-[#1F1E1B]/40 italic">
                {searchQuery || filterStatus !== 'all' ? 'No guests match your search criteria' : 'No guests added yet'}
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showGuestForm && (
          <GuestForm
            eventId={eventId}
            onSubmit={() => { fetchEventAndGuests(); setShowGuestForm(false); }}
            onCancel={() => setShowGuestForm(false)}
          />
        )}
        {selectedGuestForInvite && event && (
          <SendInvitationModal
            guest={selectedGuestForInvite}
            eventName={event.event_name}
            onClose={() => setSelectedGuestForInvite(null)}
            onSent={() => { fetchEventAndGuests(); setSelectedGuestForInvite(null); }}
          />
        )}
        {showBulkInvite && event && (
          <BulkSendInvitationModal
            guests={guests}
            eventName={event.event_name}
            onClose={() => setShowBulkInvite(false)}
            onSent={() => { fetchEventAndGuests(); setShowBulkInvite(false); }}
          />
        )}
      </div>
    </div>
  );
}
