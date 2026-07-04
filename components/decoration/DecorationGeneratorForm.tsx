// components/decoration/DecorationGeneratorForm.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  eventId: string;
  event: any;
  onPlanGenerated: (plan: any) => void;
}

export default function DecorationGeneratorForm({ eventId, event, onPlanGenerated }: Props) {
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    theme: '',
    venueType: event?.venue_type || 'banquet hall',
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    budget: event?.budget || 50000,
    guestCount: event?.guest_count || 100,
    style: 'modern' as 'modern' | 'traditional' | 'vintage' | 'rustic' | 'luxury' | 'minimalist',
    diyFriendly: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('/api/decoration/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          eventType: event?.event_type || 'celebration',
          theme: formData.theme,
          venueType: formData.venueType,
          colors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
          },
          budget: formData.budget,
          guestCount: formData.guestCount,
          style: formData.style,
          preferences: {
            diyFriendly: formData.diyFriendly,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const result = await response.json();
      onPlanGenerated(result);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate decoration plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            AI Decoration Generator
          </h2>
          <p className="text-gray-600">
            Let AI create a personalized decoration plan for your event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme Preference (Optional)
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder="e.g., Royal Elegance, Garden Party, Bollywood"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank for AI suggestion</p>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="vintage">Vintage</option>
              <option value="rustic">Rustic</option>
              <option value="luxury">Luxury</option>
              <option value="minimalist">Minimalist</option>
            </select>
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.venueType}
              onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="banquet hall">Banquet Hall</option>
              <option value="outdoor garden">Outdoor Garden</option>
              <option value="hotel ballroom">Hotel Ballroom</option>
              <option value="beach">Beach</option>
              <option value="farmhouse">Farmhouse</option>
              <option value="resort">Resort</option>
              <option value="home">Home</option>
            </select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Budget and Guest Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decoration Budget (₹)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                min="10000"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Count
              </label>
              <input
                type="number"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                min="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* DIY Friendly */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="diy"
              checked={formData.diyFriendly}
              onChange={(e) => setFormData({ ...formData, diyFriendly: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="diy" className="ml-2 text-sm text-gray-700">
              Include DIY-friendly decoration options
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={generating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Decoration Plan
              </>
            )}
          </button>
        </form>

        {generating && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800 text-center">
              AI is analyzing your preferences and creating a custom decoration plan...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
