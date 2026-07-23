// components/design-studio/CakeDesigner.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Cake } from 'lucide-react';
import { Toast, useToast } from '@/components/ui/Toast';

export default function CakeDesigner() {
  const { toasts, addToast, removeToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cakeName: '',
    occasion: 'birthday',
    theme: '',
    flavors: '',
    tiers: '1',
    shape: 'round',
    colors: '',
    decorationStyle: 'fondant',
    topperIdea: '',
    specialRequirements: '',
  });

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/design-studio/generate-cake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      addToast('🎂 Cake design generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating cake design:', error);
      addToast('Failed to generate cake design. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Cake className="w-6 h-6 text-pink-600 mr-3" />
          Cake Design Requirements
        </h2>

        <form className="space-y-6">
          {/* Cake Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cake Name/Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.cakeName}
              onChange={(e) => setFormData({ ...formData, cakeName: e.target.value })}
              placeholder="e.g., Sarah's 25th Birthday Cake"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasion <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="engagement">Engagement</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="graduation">Graduation</option>
              <option value="festival">Festival</option>
              <option value="corporate">Corporate Event</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder="e.g., Princess, Unicorn, Floral, Elegant"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Tiers and Shape */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tiers
              </label>
              <select
                value={formData.tiers}
                onChange={(e) => setFormData({ ...formData, tiers: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="1">1 Tier</option>
                <option value="2">2 Tiers</option>
                <option value="3">3 Tiers</option>
                <option value="4">4 Tiers</option>
                <option value="5">5 Tiers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shape
              </label>
              <select
                value={formData.shape}
                onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="rectangle">Rectangle</option>
                <option value="heart">Heart</option>
                <option value="hexagon">Hexagon</option>
                <option value="custom">Custom Shape</option>
              </select>
            </div>
          </div>

          {/* Flavors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flavor Preferences
            </label>
            <input
              type="text"
              value={formData.flavors}
              onChange={(e) => setFormData({ ...formData, flavors: e.target.value })}
              placeholder="e.g., Chocolate, Vanilla, Red Velvet"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Scheme
            </label>
            <input
              type="text"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              placeholder="e.g., Pink and Gold, White and Blue"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Decoration Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decoration Style
            </label>
            <select
              value={formData.decorationStyle}
              onChange={(e) => setFormData({ ...formData, decorationStyle: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="fondant">Fondant</option>
              <option value="buttercream">Buttercream</option>
              <option value="naked">Naked/Semi-Naked</option>
              <option value="drip">Drip Cake</option>
              <option value="floral">Fresh Flowers</option>
              <option value="geometric">Geometric</option>
              <option value="rustic">Rustic</option>
              <option value="elegant">Elegant/Minimal</option>
            </select>
          </div>

          {/* Topper Idea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cake Topper Ideas
            </label>
            <input
              type="text"
              value={formData.topperIdea}
              onChange={(e) => setFormData({ ...formData, topperIdea: e.target.value })}
              placeholder="e.g., Crown, Numbers, Flowers, Custom Message"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements
            </label>
            <textarea
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              placeholder="e.g., Eggless, Sugar-free, Specific design elements"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !formData.cakeName}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Generating Cake Design...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Cake Design
              </>
            )}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ImageIcon className="w-6 h-6 text-pink-600 mr-3" />
          Generated Cake Design
        </h2>

        <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center border-2 border-pink-200">
          {generating ? (
            <div className="text-center">
              <Loader2 className="animate-spin w-16 h-16 text-pink-600 mx-auto mb-4" />
              <p className="text-gray-600">AI is creating your cake design...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full">
              <img
                src={generatedImage}
                alt="Generated cake design"
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Image failed to load:', generatedImage);
                  // Retry with a fresh URL
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('&retry=')) {
                    target.src = generatedImage + '&retry=' + Date.now();
                  }
                }}
                onLoad={() => console.log('Image loaded successfully!')}
              />
              <button
                onClick={async () => {
                  if (!generatedImage) return;
                  setDownloading(true);
                  try {
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(generatedImage)}`;
                    const res = await fetch(proxyUrl);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'cake-design.png';
                    link.click();
                    URL.revokeObjectURL(url);
                    addToast('🎂 Cake design downloaded!', 'success');
                  } catch {
                    addToast('Download failed. Please try right-clicking the image to save.', 'error');
                  } finally {
                    setDownloading(false);
                  }
                }}
                disabled={downloading}
                className="absolute bottom-4 right-4 bg-white text-[#8A1C2C] px-4 py-2 rounded font-semibold shadow-lg hover:bg-[#FAF6F0] transition-colors flex items-center gap-2 border border-[#C5A880] font-sans text-xs uppercase tracking-wider disabled:opacity-60"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? 'Downloading...' : 'Download Image'}
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <Cake className="w-16 h-16 mx-auto mb-4" />
              <p>Your AI-generated cake design will appear here</p>
              <p className="text-sm mt-2">Fill the form and click generate</p>
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGenerate}
              className="w-full bg-pink-100 text-pink-700 py-3 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
            >
              🔄 Regenerate with Different Style
            </button>
            <button
              onClick={() => setGeneratedImage(null)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Create New Design
            </button>
          </div>
        )}
      </div>
    </div>
    <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
