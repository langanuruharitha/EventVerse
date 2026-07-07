'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import GuestForm from '@/components/guests/GuestForm';
import SendInvitationModal from '@/components/guests/SendInvitationModal';
import BulkSendInvitationModal from '@/components/guests/BulkSendInvitationModal';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Mail,
  Phone,
  CheckCircle,
  Users,
  Send
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
    
    const headers = ['Name', 'Email', 'Phone', 'City', 'Category', 'RSVP Status', 'Plus Ones Allowed', 'Plus Ones Confirmed', 'Dietary Restrictions'];
    
    const csvRows = guests.map(guest => {
      return [
        `"${guest.guest_name || ''}"`,
        `"${guest.email || ''}"`,
        `"${guest.phone || ''}"`,
        `"${guest.city || ''}"`,
        `"${guest.category || 'general'}"`,
        `"${guest.rsvp_status || 'pending'}"`,
        guest.plus_ones_allowed || 0,
        guest.plus_ones_confirmed || 0,
        `"${guest.dietary_restrictions || ''}"`
      ].join(',');
    });
    
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportGuests = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        
        if (lines.length <= 1) {
          throw new Error("CSV file is empty or only contains headers.");
        }

        const newGuests = lines.slice(1).map(line => {
          // Simple parsing that handles basic quotes
          const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || line.split(',');
          const cleanVals = values.map(v => v.replace(/^"|"$/g, '').trim());
          
          return {
            event_id: eventId,
            user_id: user.id,
            guest_name: cleanVals[0] || 'Unknown',
            email: cleanVals[1] || null,
            phone: cleanVals[2] || null,
            city: cleanVals[3] || null,
            category: cleanVals[4] || 'general',
            rsvp_status: cleanVals[5] || 'pending',
            plus_ones_allowed: parseInt(cleanVals[6]) || 0,
            plus_ones_confirmed: parseInt(cleanVals[7]) || 0,
            dietary_restrictions: cleanVals[8] || null,
            invitation_sent: false
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

  useEffect(() => {
    fetchEventAndGuests();
  }, [eventId]);

  const fetchEventAndGuests = async () => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('Event fetch error:', eventError);
        throw eventError;
      }
      setEvent(eventData);

      // Fetch guests
      const response = await fetch(`/api/guests?event_id=${eventId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Guest fetch failed:', errorData);
        
        // Check if it's a database column missing error
        if (errorData.error && errorData.error.includes('column')) {
          setError('database_setup');
        } else {
          setError('fetch_failed');
        }
        setGuests([]);
      } else {
        const data = await response.json();
        setGuests(data.guests || []);
      }

    } catch (error: any) {
      console.error('Error fetching data:', error);
      // Check if error message suggests missing columns
      if (error.message && (error.message.includes('column') || error.message.includes('does not exist'))) {
        setError('database_setup');
      } else {
        setError('general');
      }
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAdded = (newGuest: Guest) => {
    // Refresh guest list
    fetchEventAndGuests();
    setShowGuestForm(false);
  };

  const getFilteredGuests = () => {
    let filtered = guests;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(guest =>
        guest.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone?.includes(searchQuery)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(guest => guest.rsvp_status === filterStatus);
    }

    return filtered;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'confirmed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      tentative: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getGuestStats = () => {
    const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length;
    const totalPlusOnes = guests.reduce((sum, g) => sum + g.plus_ones_confirmed, 0);

    return { confirmed, totalPlusOnes, total: guests.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">👥</div>
          <p className="text-xl text-gray-600">Loading guest list...</p>
        </div>
      </div>
    );
  }

  // Show database setup message if needed
  if (error === 'database_setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/events/eventdetail/${eventId}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Event
          </Link>

          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🔧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Setup Required</h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  The guest management feature requires additional database columns to be set up. 
                  This is a one-time setup that takes less than 1 minute.
                </p>

                <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Quick Setup Steps:
                  </h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600">1.</span>
                      <span>Open <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">Supabase Dashboard</a></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600">2.</span>
                      <span>Click <strong>SQL Editor</strong> in the left sidebar</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600">3.</span>
                      <span>Click <strong>New Query</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600">4.</span>
                      <span>Copy and paste this SQL code:</span>
                    </li>
                  </ol>

                  <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{`ALTER TABLE guests ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS city VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS age_group VARCHAR(20) DEFAULT 'adult';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';
ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_allowed INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones_confirmed INT DEFAULT 0;`}</pre>
                  </div>

                  <ol start={5} className="space-y-3 text-sm text-gray-700 mt-4">
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600">5.</span>
                      <span>Click <strong>Run</strong> or press Ctrl+Enter</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600">6.</span>
                      <span>Come back here and refresh this page!</span>
                    </li>
                  </ol>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    ✓ I've Run the SQL - Refresh Page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/events/eventdetail/${eventId}`)}
                  >
                    Go Back to Event
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  💡 <strong>Tip:</strong> This setup is needed only once for the entire application.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const filteredGuests = getFilteredGuests();
  const stats = getGuestStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/events/eventdetail/${eventId}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Event
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Guest List</h1>
              {event && (
                <p className="text-gray-600 mt-2">
                  {event.event_name} • {new Date(event.event_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowBulkInvite(true)}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send All
              </Button>
              <Button 
                onClick={() => setShowGuestForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Guest
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Total Invited</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Plus Ones</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPlusOnes}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guests by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Guests</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="tentative">Tentative</option>
                </select>

                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImportGuests}
                />
                <Button variant="outline" className="flex items-center gap-2" onClick={handleImportClick}>
                  <Upload className="w-5 h-5" />
                  Import
                </Button>

                <Button variant="outline" className="flex items-center gap-2" onClick={handleExportGuests}>
                  <Download className="w-5 h-5" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Guests ({filteredGuests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredGuests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">RSVP Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Plus Ones</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Invitation</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((guest) => (
                      <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{guest.guest_name}</div>
                          {guest.dietary_restrictions && (
                            <div className="text-xs text-gray-500 mt-1">
                              🍽️ {guest.dietary_restrictions}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{guest.city || '-'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {guest.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                {guest.email}
                              </div>
                            )}
                            {guest.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                {guest.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700 capitalize">{guest.category}</span>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(guest.rsvp_status)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">
                            {guest.plus_ones_confirmed} / {guest.plus_ones_allowed}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {guest.invitation_sent ? (
                            <span className="text-green-600 text-sm">✓ Sent</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Not sent</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {!guest.invitation_sent && (
                            <Button
                              onClick={() => setSelectedGuestForInvite(guest)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            >
                              <Send className="w-4 h-4" />
                              Send
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No guests found</p>
                <p className="text-sm">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding guests to your event'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest Form Modal */}
        {showGuestForm && (
          <GuestForm
            eventId={eventId}
            onSubmit={handleGuestAdded}
            onCancel={() => setShowGuestForm(false)}
          />
        )}

        {/* Send Invitation Modal */}
        {selectedGuestForInvite && event && (
          <SendInvitationModal
            guest={selectedGuestForInvite}
            eventName={event.event_name}
            onClose={() => setSelectedGuestForInvite(null)}
            onSent={() => {
              fetchEventAndGuests(); // Refresh to show updated "✓ Sent" status
              setSelectedGuestForInvite(null);
            }}
          />
        )}

        {/* Bulk Send Invitation Modal */}
        {showBulkInvite && event && (
          <BulkSendInvitationModal
            guests={guests}
            eventName={event.event_name}
            onClose={() => setShowBulkInvite(false)}
            onSent={() => {
              fetchEventAndGuests();
              setShowBulkInvite(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
