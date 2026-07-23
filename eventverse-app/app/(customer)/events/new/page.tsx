'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent, getEventTypes } from '@/lib/events/actions';
import type { CreateEventFormData } from '@/types/events';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  const [formData, setFormData] = useState<CreateEventFormData>({
    event_name: '',
    event_type: 'birthday',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    guest_count: 50,
    total_budget: 50000,
    theme: '',
    venue_types: [],
    location_preference: '',
    event_timing: 'evening',
    special_requirements: '',
    selected_addons: [],
  });

  const defaultEventTypes = [
    { slug: 'birthday', name: 'Birthday Party', icon: '🎂' },
    { slug: 'wedding', name: 'Wedding Ceremony', icon: '💍' },
    { slug: 'engagement', name: 'Engagement Party', icon: '💕' },
    { slug: 'baby-shower', name: 'Baby Shower', icon: '👶' },
    { slug: 'anniversary', name: 'Anniversary', icon: '💐' },
    { slug: 'housewarming', name: 'Housewarming', icon: '🏠' },
    { slug: 'corporate', name: 'Corporate Event', icon: '🏢' },
    { slug: 'festival', name: 'Festival Celebration', icon: '🎆' },
  ];

  useEffect(() => {
    async function loadEventTypes() {
      const result = await getEventTypes();
      if (result.success && result.data && result.data.length > 0) {
        setEventTypes(result.data);
      } else {
        setEventTypes(defaultEventTypes);
      }
    }
    loadEventTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createEvent(formData);
      if (result.success && result.data) {
        router.push(`/events/eventdetail/${result.data.eventId}`);
      } else {
        setError(result.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const venueOptions = [
    { value: 'banquet_hall', label: '🏛️ Banquet Hall' },
    { value: 'garden', label: '🌳 Garden/Outdoor' },
    { value: 'hotel', label: '🏨 Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'home', label: '🏠 Home/Farmhouse' },
    { value: 'community_hall', label: '🏢 Community Hall' },
  ];

  const addonOptions = [
    { value: 'photography', label: '📸 Photography' },
    { value: 'decoration', label: '🎨 Decoration' },
    { value: 'catering', label: '🍽️ Catering' },
    { value: 'entertainment', label: '🎭 Entertainment' },
    { value: 'dj', label: '🎵 DJ/Music' },
    { value: 'return_gifts', label: '🎁 Return Gifts' },
  ];

  const inputStyle = {
    background: '#FFFDF8',
    border: '1.5px solid #DDD0BB',
    color: '#2C1810',
    fontFamily: 'Georgia, serif',
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 shadow-md">
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="text-center relative space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/30 bg-[#FAF6F0] text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans">
              ⚜ AI Event Blueprint
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#2C1810]">
              Create New Event
            </h1>
            <p className="text-sm text-[#1F1E1B]/70 italic">
              "Tell us about your celebration requirements and let our AI architect formulate a bespoke blueprint plan."
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-3 rounded text-sm text-center"
                style={{ background: '#FFF0F0', border: '1px solid #F5BDBD', color: '#8A1C2C' }}>
                {error}
              </div>
            )}

            {loading && (
              <div className="p-4 rounded border"
                style={{ background: 'rgba(197,168,128,0.08)', borderColor: '#C5A880' }}>
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderBottomColor: '#8A1C2C' }} />
                  <div>
                    <div className="font-bold text-[#8A1C2C] text-sm font-serif">Generating AI Blueprint Plan...</div>
                    <div className="text-xs text-[#7A6652] italic font-sans mt-0.5">Please wait, this will take approximately 10-15 seconds</div>
                  </div>
                </div>
              </div>
            )}

            {/* Event Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded outline-none"
                style={inputStyle}
                placeholder="e.g. Royal Wedding Reception of Sarah & Mark"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                Event Type *
              </label>
              <select
                required
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded outline-none"
                style={{ ...inputStyle, appearance: 'auto' }}
              >
                {eventTypes.map((type) => (
                  <option key={type.slug} value={type.slug}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.event_date ? formData.event_date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, event_date: new Date(e.target.value) })}
                  min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10000"
                  value={formData.guest_count}
                  onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                Total Budget (₹) *
              </label>
              <input
                type="number"
                required
                min="5000"
                step="1000"
                value={formData.total_budget}
                onChange={(e) => setFormData({ ...formData, total_budget: parseInt(e.target.value) })}
                className="w-full px-4 py-3 text-sm rounded outline-none"
                style={inputStyle}
              />
              <p className="text-xs text-[#7A6652] mt-1.5 italic">
                Suggested allocation: ₹{(formData.guest_count * 1000).toLocaleString('en-IN')} (approx. ₹1,000 per guest)
              </p>
            </div>

            {/* Theme & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                  Theme / Style Preference
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  style={inputStyle}
                  placeholder="e.g. Traditional Royal, Golden Vintage"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                  Location Preference
                </label>
                <input
                  type="text"
                  value={formData.location_preference}
                  onChange={(e) => setFormData({ ...formData, location_preference: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  style={inputStyle}
                  placeholder="e.g. Hyderabad, Mumbai"
                />
              </div>
            </div>

            {/* Event Timing */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                Event Timing
              </label>
              <select
                value={formData.event_timing}
                onChange={(e) => setFormData({ ...formData, event_timing: e.target.value as any })}
                className="w-full px-4 py-3 text-sm rounded outline-none"
                style={{ ...inputStyle, appearance: 'auto' }}
              >
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
                <option value="night">Night (8 PM - 12 AM)</option>
                <option value="full_day">Full Day</option>
              </select>
            </div>

            {/* Venue Prefs */}
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-widest text-[#7A6652]">
                Venue Preferences
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-sans text-xs">
                {venueOptions.map((venue) => (
                  <label
                    key={venue.value}
                    className="flex items-center gap-2 p-3 border rounded cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: formData.venue_types?.includes(venue.value) ? '#8A1C2C' : '#DDD0BB',
                      background: formData.venue_types?.includes(venue.value) ? 'rgba(138,28,44,0.05)' : '#FFFDF8',
                      color: '#2C1810',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.venue_types?.includes(venue.value)}
                      onChange={(e) => {
                        const current = formData.venue_types || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, venue_types: [...current, venue.value] });
                        } else {
                          setFormData({ ...formData, venue_types: current.filter((v) => v !== venue.value) });
                        }
                      }}
                      className="accent-[#8A1C2C]"
                    />
                    <span>{venue.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-widest text-[#7A6652]">
                Services Needed
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-sans text-xs">
                {addonOptions.map((addon) => (
                  <label
                    key={addon.value}
                    className="flex items-center gap-2 p-3 border rounded cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: formData.selected_addons?.includes(addon.value) ? '#8A1C2C' : '#DDD0BB',
                      background: formData.selected_addons?.includes(addon.value) ? 'rgba(138,28,44,0.05)' : '#FFFDF8',
                      color: '#2C1810',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selected_addons?.includes(addon.value)}
                      onChange={(e) => {
                        const current = formData.selected_addons || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, selected_addons: [...current, addon.value] });
                        } else {
                          setFormData({ ...formData, selected_addons: current.filter((a) => a !== addon.value) });
                        }
                      }}
                      className="accent-[#8A1C2C]"
                    />
                    <span>{addon.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest text-[#7A6652]">
                Special Requirements & Details
              </label>
              <textarea
                value={formData.special_requirements}
                onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 text-sm rounded outline-none"
                style={inputStyle}
                placeholder="e.g. Vegetarian food options, valet parking requested, classic vintage stage set..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              style={{
                background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                color: '#FAF0E0',
                boxShadow: '0 4px 16px rgba(138,28,44,0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Generating Blueprint Plan...
                </span>
              ) : (
                '🤖 Generate AI Event Plan'
              )}
            </button>
            <p className="text-[11px] text-[#7A6652] text-center italic mt-2">
              Our AI architect will automatically formulate your custom event roadmap, task checklists, budget categories, and shopping lists in 10-15 seconds.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
