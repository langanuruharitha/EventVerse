'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download, Image as ImageIcon, FileImage, Loader2 } from 'lucide-react';
import { Toast, useToast } from '@/components/ui/Toast';

function CreateCardInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toasts, addToast, removeToast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<string | null>(null);

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
    if (!formData.eventName || !formData.fromName || !formData.date || !formData.time || !formData.venue) {
      addToast('Please fill all required fields before generating.', 'error');
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
      console.log('API Response:', { ok: response.ok, hasHtml: !!data.htmlContent, aiTheme: data.aiThemeApplied, geminiError: data.geminiError, error: data.error });

      if (response.ok && data.htmlContent) {
        setGeneratedCard(data.htmlContent);
        setStep(2);
        addToast('🎉 Invitation card generated successfully!', 'success');
      } else {
        addToast('Error: ' + (data.error || 'Failed to generate invitation card'), 'error');
      }
    } catch (error) {
      console.error('Error generating card:', error);
      addToast('Failed to generate invitation card. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Download invitation as PNG image using html2canvas
  const downloadAsImage = async () => {
    if (!generatedCard) return;
    setDownloadingPng(true);
    addToast('Preparing your PNG download...', 'info');
    try {
      // Load html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      // Create a hidden iframe to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:800px;height:1100px;overflow:hidden;z-index:-1;';
      tempDiv.innerHTML = generatedCard;
      document.body.appendChild(tempDiv);
      await new Promise(r => setTimeout(r, 600)); // wait for render
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fff',
        width: 800,
        height: 1100,
      });
      document.body.removeChild(tempDiv);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `invitation-${formData.eventName || 'card'}.png`;
      link.click();
      addToast('📥 Invitation card downloaded as PNG!', 'success');
    } catch (err) {
      console.error('PNG download failed:', err);
      addToast('PNG download failed. Downloading as HTML instead.', 'error');
      // Fallback to HTML download
      const blob = new Blob([generatedCard], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'invitation-card.html'; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingPng(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-[#2C1810] text-[#FAF0E0] py-8 border-b border-[#C5A880]/30 relative">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/invitations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider font-sans mb-3 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Invitations
          </Link>
          <h1 className="text-3xl font-bold mb-1">⚜ Create Custom Invitation Card</h1>
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
                  Creative Requirements & Theme Description (Optional)
                </label>
                <textarea
                  value={formData.themeDescription}
                  onChange={(e) => setFormData({ ...formData, themeDescription: e.target.value })}
                  placeholder="Describe what you want: e.g., 'Create a warm, elegant invitation with golden decorations, floral borders, and a poetic message about celebration and togetherness. Use sophisticated language and make it feel special.'"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    generating
                  }
                  className="w-full py-3.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin text-base">⚜</div>
                      <div className="text-center font-serif">
                        <div className="font-bold text-sm">Gemini AI is formulating your blueprint...</div>
                        <div className="text-[10px] italic opacity-80">Generating bespoke artistic content (5-10 seconds)</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Bespoke Invitation with AI
                    </>
                  )}
                </button>
                <div className="bg-[#FAF6F0] border border-[#DDD0BB] rounded-lg p-4 mt-3 font-sans">
                  <p className="text-xs text-[#2C1810] font-bold mb-2 font-serif">
                    ⚜ What Gemini AI Will Create For You:
                  </p>
                  <ul className="text-[11px] text-[#1F1E1B]/70 space-y-1 ml-4 list-disc">
                    <li>Unique creative text and royal greetings customized to your ceremony</li>
                    <li>Beautiful traditional backgrounds and gold filigree styling</li>
                    <li>Poetic, heartfelt messages matching your event mood</li>
                    <li>Professional bespoken design - completely original every time!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Generated Card */}
        {step === 2 && generatedCard && (
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#2C1810] mb-6 text-center">
              🎉 Your Custom Invitation Card is Ready!
            </h2>

            {/* Generated Card Preview */}
            <div className="mb-8">
              <div className="border-2 border-double border-[#C5A880] rounded overflow-hidden bg-white max-w-2xl mx-auto shadow-lg">
                <iframe
                  srcDoc={generatedCard || ''}
                  style={{ width: '100%', height: '820px', border: 'none' }}
                  title="Generated Invitation Card"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 font-sans text-xs">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-[#DDD0BB] text-[#7A6652] font-semibold rounded hover:bg-[#FAF6F0] transition"
              >
                Edit Details
              </button>
              <button
                onClick={downloadAsImage}
                disabled={downloadingPng}
                className="flex-1 py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] font-bold rounded flex items-center justify-center gap-2 uppercase tracking-wider hover:shadow transition disabled:opacity-60"
              >
                {downloadingPng ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
                {downloadingPng ? 'Creating PNG...' : 'Download as PNG'}
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
                  addToast('📄 Invitation downloaded as HTML!', 'success');
                }}
                className="flex-1 py-3 border border-[#8A1C2C] text-[#8A1C2C] font-bold rounded flex items-center justify-center gap-2 uppercase tracking-wider hover:bg-[#FAF6F0] transition"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
              <button
                onClick={() => router.push('/invitations')}
                className="flex-1 py-3 bg-green-700 text-white font-bold rounded hover:bg-green-800 uppercase tracking-wider transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
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
