'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download, Image as ImageIcon } from 'lucide-react';

function CreateCardInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: Form, 2: Preview/Generated
  const [generating, setGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<string | null>(null); // raw HTML string

  // Form data
  const [formData, setFormData] = useState({
    eventType: searchParams.get('type') || 'birthday',
    eventName: '',
    fromName: '',
    toName: '',
    date: '',
    time: '',
    venue: '',
    message: '',
    style: 'elegant',
    includeRSVP: true,
    themeDescription: ''
  });

  const handleGenerate = async () => {
    if (!formData.eventName || !formData.fromName || !formData.date || !formData.time || !formData.venue || !formData.themeDescription) {
      alert('Please fill all required fields including the Creative Requirements & Theme Description');
      return;
    }

    setGenerating(true);

    try {
      // Call AI to generate invitation card with AI-generated background
      const response = await fetch('/api/invitations/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.htmlContent) {
        setGeneratedCard(data.htmlContent);
        setStep(2);
      } else {
        alert(data.error || 'Failed to generate invitation card');
      }
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Failed to generate invitation card. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/invitations"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Invitations
          </Link>
          <h1 className="text-4xl font-bold mb-2">✨ Create Custom Invitation Card</h1>
          <p className="text-purple-100">
            {step === 1 && 'Fill in your event details and AI will create a beautiful invitation'}
            {step === 2 && 'Your custom invitation card is ready!'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Event Details
            </h2>

            <div className="space-y-6">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['birthday', 'wedding', 'anniversary', 'corporate'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, eventType: type })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.eventType === type
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">
                        {type === 'birthday' && '🎂'}
                        {type === 'wedding' && '💍'}
                        {type === 'anniversary' && '💐'}
                        {type === 'corporate' && '🏢'}
                      </div>
                      <div className="text-sm font-semibold capitalize">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  placeholder="e.g., Sarah's 25th Birthday Party"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* From Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From (Host Name) *
                </label>
                <input
                  type="text"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  placeholder="e.g., John & Jane Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* To Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To (Guest Name)
                </label>
                <input
                  type="text"
                  value={formData.toName}
                  onChange={(e) => setFormData({ ...formData, toName: e.target.value })}
                  placeholder="e.g., Dear Friends & Family (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g., Royal Gardens, Mumbai"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g., Join us for an evening of celebration..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Theme & Background Decoration Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Creative Requirements & Theme Description *
                </label>
                <textarea
                  value={formData.themeDescription}
                  onChange={(e) => setFormData({ ...formData, themeDescription: e.target.value })}
                  placeholder="Describe what you want: e.g., 'Create a warm, elegant invitation with golden decorations, floral borders, and a poetic message about celebration and togetherness. Use sophisticated language and make it feel special.'"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Be specific! AI will create unique content, design, and wording based on your description. Don't just repeat basic info - describe the style, mood, and creativity you want!
                </p>
              </div>



              {/* Style */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Design Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['elegant', 'modern', 'traditional'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setFormData({ ...formData, style })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.style === style
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold capitalize">{style}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RSVP Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rsvp"
                  checked={formData.includeRSVP}
                  onChange={(e) => setFormData({ ...formData, includeRSVP: e.target.checked })}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="rsvp" className="text-sm font-semibold text-gray-700">
                  Include RSVP details
                </label>
              </div>

              {/* Generate Button */}
              <div className="pt-6">
                <button
                  onClick={handleGenerate}
                  disabled={
                    !formData.eventName ||
                    !formData.fromName ||
                    !formData.date ||
                    !formData.time ||
                    !formData.venue ||
                    !formData.themeDescription ||
                    generating
                  }
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      <div className="text-center">
                        <div className="font-bold">Gemini AI is creating your invitation...</div>
                        <div className="text-sm mt-1">Generating unique creative content (5-10 seconds)</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Custom Invitation with AI
                    </>
                  )}
                </button>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mt-3">
                  <p className="text-sm text-purple-900 font-semibold mb-2">
                    🤖 What Gemini AI Will Create For You:
                  </p>
                  <ul className="text-xs text-purple-800 space-y-1 ml-4">
                    <li>✓ Unique creative text and greetings (NOT copy-paste of your input!)</li>
                    <li>✓ Beautiful artistic gradient backgrounds based on your theme</li>
                    <li>✓ Poetic, heartfelt messages that match your event mood</li>
                    <li>✓ Professional design - completely original every time!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Generated Card */}
        {step === 2 && generatedCard && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🎉 Your Custom Invitation Card is Ready!
            </h2>

            {/* Generated Card Preview */}
            <div className="mb-8">
              <div className="border-4 border-purple-200 rounded-xl overflow-hidden bg-white max-w-2xl mx-auto shadow-2xl">
                <iframe
                  srcDoc={generatedCard || ''}
                  style={{ width: '100%', height: '820px', border: 'none' }}
                  title="Generated Invitation Card"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Edit Details
              </button>
              <button
                onClick={() => {
                  if (!generatedCard) return;
                  const blob = new Blob([generatedCard], { type: 'text/html;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'invitation-card.html';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Card
              </button>
              <button
                onClick={() => router.push('/invitations')}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateCardInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateCardInvitationContent />
    </Suspense>
  );
}
