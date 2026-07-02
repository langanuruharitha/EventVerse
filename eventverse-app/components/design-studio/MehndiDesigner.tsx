// components/design-studio/MehndiDesigner.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Hand } from 'lucide-react';

export default function MehndiDesigner() {
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    occasion: 'wedding',
    designStyle: 'traditional',
    pattern: 'arabic',
    placement: 'full-hands',
    theme: '',
    complexity: 'medium',
    elements: '',
    specialMotifs: '',
  });

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/design-studio/generate-mehndi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      setGeneratedImage(result.imageUrl);
    } catch (error) {
      console.error('Error generating mehndi design:', error);
      alert('Failed to generate mehndi design. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Hand className="w-6 h-6 text-orange-600 mr-3" />
          Mehndi Design Requirements
        </h2>

        <form className="space-y-6">
          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasion <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="wedding">Wedding</option>
              <option value="engagement">Engagement</option>
              <option value="festival">Festival (Diwali, Eid)</option>
              <option value="karwachauth">Karwa Chauth</option>
              <option value="teej">Teej</option>
              <option value="sangeet">Sangeet</option>
              <option value="mehendi-ceremony">Mehendi Ceremony</option>
              <option value="casual">Casual/Party</option>
            </select>
          </div>

          {/* Design Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Design Style <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.designStyle}
              onChange={(e) => setFormData({ ...formData, designStyle: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="traditional">Traditional Indian</option>
              <option value="modern">Modern Contemporary</option>
              <option value="fusion">Fusion</option>
              <option value="minimal">Minimal/Simple</option>
              <option value="bridal">Bridal (Heavy)</option>
            </select>
          </div>

          {/* Pattern Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Type
            </label>
            <select
              value={formData.pattern}
              onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="arabic">Arabic</option>
              <option value="indian">Indian/Rajasthani</option>
              <option value="pakistani">Pakistani</option>
              <option value="moroccan">Moroccan</option>
              <option value="indo-arabic">Indo-Arabic</option>
              <option value="floral">Floral</option>
              <option value="geometric">Geometric</option>
              <option value="peacock">Peacock Motif</option>
            </select>
          </div>

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placement
            </label>
            <select
              value={formData.placement}
              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="full-hands">Full Hands (Both)</option>
              <option value="palms">Palms Only</option>
              <option value="back-hands">Back of Hands</option>
              <option value="fingers">Fingers Only</option>
              <option value="arms">Up to Arms</option>
              <option value="feet">Feet Design</option>
              <option value="one-hand">Single Hand</option>
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Design Complexity
            </label>
            <select
              value={formData.complexity}
              onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="simple">Simple (30 mins)</option>
              <option value="medium">Medium (1-2 hours)</option>
              <option value="complex">Complex (3-4 hours)</option>
              <option value="bridal">Bridal (5+ hours)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme (Optional)
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder="e.g., Royal, Nature, Love Story"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Elements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Elements
            </label>
            <input
              type="text"
              value={formData.elements}
              onChange={(e) => setFormData({ ...formData, elements: e.target.value })}
              placeholder="e.g., Flowers, Peacocks, Paisleys, Mandalas"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Special Motifs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Motifs/Names
            </label>
            <textarea
              value={formData.specialMotifs}
              onChange={(e) => setFormData({ ...formData, specialMotifs: e.target.value })}
              placeholder="e.g., Include couple names, specific symbols, initials"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Generating Mehndi Design...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Mehndi Design
              </>
            )}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ImageIcon className="w-6 h-6 text-orange-600 mr-3" />
          Generated Mehndi Design
        </h2>

        <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center border-2 border-orange-200">
          {generating ? (
            <div className="text-center">
              <Loader2 className="animate-spin w-16 h-16 text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600">AI is creating your mehndi design...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full">
              <img
                src={generatedImage}
                alt="Generated mehndi design"
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Mehndi image failed to load:', generatedImage);
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('&retry=')) {
                    target.src = generatedImage + '&retry=' + Date.now();
                  }
                }}
                onLoad={() => console.log('Mehndi image loaded successfully!')}
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'mehndi-design.png';
                  link.click();
                }}
                className="absolute bottom-4 right-4 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <Hand className="w-16 h-16 mx-auto mb-4" />
              <p>Your AI-generated mehndi design will appear here</p>
              <p className="text-sm mt-2">Fill the form and click generate</p>
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGenerate}
              className="w-full bg-orange-100 text-orange-700 py-3 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
            >
              🔄 Regenerate with Different Pattern
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
  );
}
