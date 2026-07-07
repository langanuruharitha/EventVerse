'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent, getEventTypes } from '@/lib/events/actions';
import type { CreateEventFormData } from '@/types/events';
import { useEffect } from 'react';

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
      console.log('Submitting event...', formData);
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
    { value: 'resort', label: '🏖️ Resort' },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Event with AI 🤖
          </h1>
          <p className="text-gray-600">
            Tell us about your event and let AI create a complete plan for you!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div className="text-blue-800">
                  <div className="font-semibold">Generating AI Blueprint...</div>
                  <div className="text-sm">This may take 10-15 seconds</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={formData.event_name}
                onChange={(e) =>
                  setFormData({ ...formData, event_name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Sarah's 25th Birthday Party"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                required
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({ ...formData, event_type: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.event_date.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: new Date(e.target.value) })
                  }
                  min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10000"
                  value={formData.guest_count}
                  onChange={(e) =>
                    setFormData({ ...formData, guest_count: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Budget (₹) *
              </label>
              <input
                type="number"
                required
                min="5000"
                step="1000"
                value={formData.total_budget}
                onChange={(e) =>
                  setFormData({ ...formData, total_budget: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Suggested: ₹{(formData.guest_count * 1000).toLocaleString('en-IN')} (₹1000 per
                guest)
              </p>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Theme (Optional)
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) =>
                  setFormData({ ...formData, theme: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Vintage, Modern, Traditional"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location Preference
              </label>
              <input
                type="text"
                value={formData.location_preference}
                onChange={(e) =>
                  setFormData({ ...formData, location_preference: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
              />
            </div>

            {/* Event Timing */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Timing
              </label>
              <select
                value={formData.event_timing}
                onChange={(e) =>
                  setFormData({ ...formData, event_timing: e.target.value as any })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
                <option value="night">Night (8 PM - 12 AM)</option>
                <option value="full_day">Full Day</option>
              </select>
            </div>

            {/* Venue Types */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Venue Preferences (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {venueOptions.map((venue) => (
                  <label
                    key={venue.value}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.venue_types?.includes(venue.value)}
                      onChange={(e) => {
                        const current = formData.venue_types || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            venue_types: [...current, venue.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            venue_types: current.filter((v) => v !== venue.value),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{venue.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Services Needed (Select what you need)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {addonOptions.map((addon) => (
                  <label
                    key={addon.value}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selected_addons?.includes(addon.value)}
                      onChange={(e) => {
                        const current = formData.selected_addons || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            selected_addons: [...current, addon.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            selected_addons: current.filter((a) => a !== addon.value),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{addon.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.special_requirements}
                onChange={(e) =>
                  setFormData({ ...formData, special_requirements: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Vegetarian food only, wheelchair accessible venue, outdoor seating..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating AI Plan...
                </span>
              ) : (
                '🤖 Generate AI Event Plan'
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              AI will create a complete event blueprint with budget breakdown, timeline,
              shopping list, and vendor recommendations in 10-15 seconds
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
