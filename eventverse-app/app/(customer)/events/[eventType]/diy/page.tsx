'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/events/actions';
import type { CreateEventFormData } from '@/types/events';
import Link from 'next/link';

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

export default function DIYPlanningPage({ params }: { params: Promise<{ eventType: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [showPlan, setShowPlan] = useState(false);
  
  // Get event type from URL using React.use()
  const { eventType: eventTypeSlug } = use(params);
  const eventTypeInfo = EVENT_TYPES_MAP[eventTypeSlug] || { name: 'Event', icon: '🎉' };

  const [formData, setFormData] = useState<CreateEventFormData>({
    event_name: '',
    event_type: eventTypeSlug,
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

  const [ageGroup, setAgeGroup] = useState('');
  const [foodPreference, setFoodPreference] = useState<string[]>([]);
  const [alcoholServing, setAlcoholServing] = useState('no');
  const [parkingRequired, setParkingRequired] = useState('yes');
  const [accommodationNeeded, setAccommodationNeeded] = useState('no');
  const [photographyStyle, setPhotographyStyle] = useState<string[]>([]);
  const [decorationBudget, setDecorationBudget] = useState('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine all additional requirements into special_requirements
      const additionalRequirements = [
        ageGroup && `Age Group: ${ageGroup}`,
        foodPreference.length > 0 && `Food Preferences: ${foodPreference.join(', ')}`,
        `Alcohol: ${alcoholServing === 'yes' ? 'Yes' : 'No'}`,
        `Parking: ${parkingRequired === 'yes' ? 'Required' : 'Not Required'}`,
        accommodationNeeded === 'yes' && 'Accommodation needed for guests',
        photographyStyle.length > 0 && `Photography Style: ${photographyStyle.join(', ')}`,
        `Decoration Budget: ${decorationBudget}`,
        formData.special_requirements
      ].filter(Boolean).join('. ');

      const enhancedFormData = {
        ...formData,
        special_requirements: additionalRequirements
      };

      console.log('Creating event with AI...', enhancedFormData);
      const result = await createEvent(enhancedFormData);

      if (result.success && result.data) {
        const eventId = result.data.eventId;
        console.log('✅ Event created successfully, ID:', eventId);
        
        // Fetch the complete event data to show the plan
        const { getEvent } = await import('@/lib/events/actions');
        const eventResult = await getEvent(eventId);
        
        if (eventResult.success && eventResult.data) {
          setGeneratedPlan(eventResult.data);
          setShowPlan(true);
          
          // Scroll to the plan section
          setTimeout(() => {
            const planSection = document.getElementById('generated-plan');
            if (planSection) {
              planSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      } else {
        console.error('❌ Failed to create event:', result.error);
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 shadow-md">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="text-center relative space-y-4">
            <div className="text-5xl mb-2">{eventTypeInfo.icon}</div>
            <h1 className="text-3xl font-bold tracking-tight text-[#2C1810]">
              Plan Your {eventTypeInfo.name}
            </h1>
            <p className="text-sm text-[#1F1E1B]/70 italic">
              "Input your preferences and let our AI system generate a personalized heritage blueprint checklist."
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded border border-[#DDD0BB] shadow-sm p-8 space-y-6">
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
                  <div className="font-bold text-[#8A1C2C] text-sm">🤖 Generating AI Blueprint...</div>
                  <div className="text-xs text-[#7A6652] italic font-sans mt-0.5">Please wait, this will take approximately 10-15 seconds</div>
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
                placeholder={`e.g., Sarah's ${eventTypeInfo.name}`}
              />
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
                placeholder="e.g., Vintage, Modern, Traditional, Rustic"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location/City *
              </label>
              <input
                type="text"
                required
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
                Event Timing *
              </label>
              <select
                required
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
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
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
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm font-medium">{venue.label}</span>
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
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
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
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm font-medium">{addon.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guest Age Group
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select age group</option>
                <option value="kids">Kids (0-12 years)</option>
                <option value="teens">Teens (13-19 years)</option>
                <option value="adults">Adults (20-50 years)</option>
                <option value="seniors">Seniors (50+ years)</option>
                <option value="mixed">Mixed (All age groups)</option>
              </select>
            </div>

            {/* Food Preferences */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Food Preferences (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'vegetarian', label: '🥗 Vegetarian' },
                  { value: 'non-vegetarian', label: '🍗 Non-Vegetarian' },
                  { value: 'vegan', label: '🌱 Vegan' },
                  { value: 'jain', label: '🚫 Jain Food' },
                  { value: 'continental', label: '🍝 Continental' },
                  { value: 'chinese', label: '🥟 Chinese' },
                ].map((food) => (
                  <label
                    key={food.value}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={foodPreference.includes(food.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFoodPreference([...foodPreference, food.value]);
                        } else {
                          setFoodPreference(foodPreference.filter((f) => f !== food.value));
                        }
                      }}
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm font-medium">{food.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alcohol Serving */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alcohol Serving
                </label>
                <select
                  value={alcoholServing}
                  onChange={(e) => setAlcoholServing(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="no">🚫 No</option>
                  <option value="yes">🍷 Yes</option>
                  <option value="limited">🥃 Limited (Soft drinks only)</option>
                </select>
              </div>

              {/* Parking */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parking Required
                </label>
                <select
                  value={parkingRequired}
                  onChange={(e) => setParkingRequired(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="yes">✅ Yes</option>
                  <option value="no">❌ No</option>
                  <option value="valet">🚗 Valet Parking</option>
                </select>
              </div>

              {/* Accommodation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Accommodation
                </label>
                <select
                  value={accommodationNeeded}
                  onChange={(e) => setAccommodationNeeded(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="no">Not Required</option>
                  <option value="yes">🏨 Required</option>
                  <option value="partial">Some guests need rooms</option>
                </select>
              </div>

              {/* Decoration Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Decoration Budget Level
                </label>
                <select
                  value={decorationBudget}
                  onChange={(e) => setDecorationBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="minimal">💰 Minimal (Basic)</option>
                  <option value="medium">💰💰 Medium (Standard)</option>
                  <option value="lavish">💰💰💰 Lavish (Premium)</option>
                </select>
              </div>
            </div>

            {/* Photography Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Photography Style (if needed)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'candid', label: '📷 Candid' },
                  { value: 'traditional', label: '📸 Traditional' },
                  { value: 'cinematic', label: '🎥 Cinematic' },
                  { value: 'drone', label: '🚁 Drone Coverage' },
                ].map((style) => (
                  <label
                    key={style.value}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={photographyStyle.includes(style.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPhotographyStyle([...photographyStyle, style.value]);
                        } else {
                          setPhotographyStyle(photographyStyle.filter((s) => s !== style.value));
                        }
                      }}
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm font-medium">{style.label}</span>
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
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Vegetarian food only, wheelchair accessible venue, outdoor seating, specific color scheme, any dietary restrictions..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                color: '#FAF0E0',
                boxShadow: '0 4px 16px rgba(138,28,44,0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Generating Plan...
                </span>
              ) : (
                '🤖 Generate AI Event Plan'
              )}
            </button>

            <div className="bg-[#FAF6F0] border border-[#DDD0BB] p-4 rounded text-xs italic">
              <p className="text-[#1F1E1B]/70 text-center">
                <strong>✨ What you&apos;ll get:</strong> Complete event blueprint with budget breakdown, timeline, task checklist, shopping list, vendor recommendations, decoration ideas, and food suggestions - all personalized for your requirements!
              </p>
            </div>
          </div>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/events/${eventTypeSlug}`}
            className="inline-flex items-center text-xs font-bold text-[#1F1E1B]/70 hover:text-[#8A1C2C] uppercase tracking-wider font-sans transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Planning Options
          </Link>
        </div>

        {/* Generated Plan Section */}
        {showPlan && generatedPlan && (
          <div id="generated-plan" className="mt-12 space-y-8">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                Your Event Plan is Ready!
              </h2>
              <p className="text-green-700">
                AI has created a personalized plan for "{generatedPlan.event_name}" with all your details!
              </p>
            </div>

            {/* Event Summary */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{eventTypeInfo.icon}</div>
                <h2 className="text-3xl font-bold mb-2">{generatedPlan.event_name}</h2>
                <p className="text-purple-100">
                  {new Date(generatedPlan.event_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-purple-200 text-sm">Guests</div>
                  <div className="font-bold text-2xl">{generatedPlan.guest_count}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-200 text-sm">Budget</div>
                  <div className="font-bold text-2xl">
                    ₹{generatedPlan.total_budget.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-purple-200 text-sm">Tasks</div>
                  <div className="font-bold text-2xl">{generatedPlan.total_tasks || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-200 text-sm">Shopping Items</div>
                  <div className="font-bold text-2xl">{generatedPlan.total_shopping_items || 0}</div>
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            {generatedPlan.ai_blueprint?.budgetBreakdown && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  💰 Budget Breakdown
                </h3>
                <div className="space-y-4">
                  {generatedPlan.ai_blueprint.budgetBreakdown.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{item.category}</div>
                        <div className="text-sm text-gray-500">
                          {((item.amount / generatedPlan.total_budget) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {generatedPlan.ai_blueprint?.timeline && generatedPlan.ai_blueprint.timeline.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📅 Timeline & Milestones
                </h3>
                <div className="space-y-6">
                  {generatedPlan.ai_blueprint.timeline.map((milestone: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="text-lg font-bold text-purple-600">
                          Week {milestone.weeks_before}
                        </div>
                        <div className="text-xs text-gray-500">before</div>
                      </div>
                      <div className="flex-1 border-l-4 border-purple-200 pl-4">
                        <div className="font-bold text-lg text-gray-900">{milestone.milestone_name}</div>
                        <div className="text-gray-600 mt-1">{milestone.description}</div>
                        {milestone.tasks && milestone.tasks.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {milestone.tasks.map((task: string, taskIndex: number) => (
                              <li key={taskIndex} className="text-sm text-gray-500 flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shopping List */}
            {generatedPlan.ai_blueprint?.shoppingList && generatedPlan.ai_blueprint.shoppingList.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🛒 Shopping List
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPlan.ai_blueprint.shoppingList.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.item_name}</div>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity} • {item.category}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-purple-600">
                          ₹{item.estimated_price.toLocaleString('en-IN')}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded mt-1 ${
                            item.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : item.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {item.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vendor Recommendations */}
            {generatedPlan.ai_blueprint?.vendorRecommendations && generatedPlan.ai_blueprint.vendorRecommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🏪 Vendor Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPlan.ai_blueprint.vendorRecommendations.map((vendor: any, index: number) => (
                    <div key={index} className="border-2 border-purple-200 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-lg text-gray-900">{vendor.category}</div>
                        <div className="font-bold text-xl text-purple-600">
                          ₹{vendor.estimated_cost.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{vendor.vendor_type}</div>
                      {vendor.tips && vendor.tips.length > 0 && (
                        <ul className="space-y-2">
                          {vendor.tips.map((tip: string, tipIndex: number) => (
                            <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-lg">💡</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decoration Ideas */}
            {generatedPlan.ai_blueprint?.decorationIdeas && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🎨 Decoration Ideas
                </h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {generatedPlan.ai_blueprint.decorationIdeas}
                </div>
              </div>
            )}

            {/* Food Suggestions */}
            {generatedPlan.ai_blueprint?.foodSuggestions && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🍽️ Food Menu Suggestions
                </h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {generatedPlan.ai_blueprint.foodSuggestions}
                </div>
              </div>
            )}

            {/* Helpful Tips */}
            {generatedPlan.ai_blueprint?.tips && generatedPlan.ai_blueprint.tips.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-2">
                  💡 Helpful Tips
                </h3>
                <ul className="space-y-3">
                  {generatedPlan.ai_blueprint.tips.map((tip: string, index: number) => (
                    <li key={index} className="text-gray-700 flex items-start gap-3">
                      <span className="text-yellow-600 text-xl">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/events/my-events"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                View in My Events
              </Link>
              <button
                onClick={() => {
                  setShowPlan(false);
                  setGeneratedPlan(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
              >
                Create Another Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
