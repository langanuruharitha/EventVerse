// components/design-studio/MehndiDesigner.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Hand, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadImage, downloadSpecSheet } from '@/lib/utils/download-helper';

const CURATED_MEHNDI = [
  {
    id: 'mehndi-1',
    occasion: 'wedding',
    designStyle: 'bridal',
    pattern: 'indian',
    placement: 'full-hands',
    theme: 'Royal Heritage Bridal',
    complexity: 'bridal',
    elements: 'Dulha-Dulhan Portraits, Shehnai, Doli & Kalash',
    specialMotifs: 'Groom Initial hidden in left palm pattern',
    imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    description: 'Intricate traditional Rajasthani bridal henna featuring ceremonial portraits and heritage motifs.'
  },
  {
    id: 'mehndi-2',
    occasion: 'engagement',
    designStyle: 'modern',
    pattern: 'arabic',
    placement: 'back-hands',
    theme: 'Arabic Floral Symphony',
    complexity: 'medium',
    elements: 'Bold Rose Outlines, Leafy Vines, Shaded Petals',
    specialMotifs: 'Flowing wrist cuff and index finger extension',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Chic Arabic henna design with bold shaded floral outlines extending gracefully down the back of the hand.'
  },
  {
    id: 'mehndi-3',
    occasion: 'festival',
    designStyle: 'minimal',
    pattern: 'floral',
    placement: 'palms',
    theme: 'Sacred Lotus Mandala',
    complexity: 'simple',
    elements: 'Central Lotus Circle, Delicate Finger Caps, Dotted Lines',
    specialMotifs: 'Lotus bloom in palm center with ring jewelry details',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Clean & minimalist lotus mandala ideal for festive occasions and casual celebrations.'
  },
  {
    id: 'mehndi-4',
    occasion: 'sangeet',
    designStyle: 'fusion',
    pattern: 'indo-arabic',
    placement: 'full-hands',
    theme: 'Peacock Lattice Fusion',
    complexity: 'complex',
    elements: 'Dancing Peacock Motifs, Jaali Mesh Work, Paisley Bands',
    specialMotifs: 'Symmetrical peacock crests on both palms',
    imageUrl: 'https://images.unsplash.com/photo-1565498904797-152e00810db6?auto=format&fit=crop&w=800&q=80',
    description: 'A rich fusion pattern blending intricate Indian jaali mesh with bold Arabic peacock accents.'
  }
];

export default function MehndiDesigner() {
  const toast = useToast();
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
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
      toast('🤏 Mehndi design generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating mehndi design:', error);
      toast('Failed to generate mehndi design. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadImage = async (url: string, title: string) => {
    setDownloading(true);
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mehndi.png`;
    const success = await downloadImage(url, filename);
    if (success) {
      toast('🤏 Mehndi design image downloaded!', 'success');
    } else {
      toast('Opened mehndi image in new tab for direct download.', 'info');
    }
    setDownloading(false);
  };

  const handleDownloadSpec = (title: string, details: Record<string, any>) => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-artist-blueprint.txt`;
    downloadSpecSheet(title, 'Mehndi', details, filename);
    toast('📄 Mehndi Artist Spec Blueprint downloaded!', 'success');
  };

  return (
    <div className="space-y-12">
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
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="w-6 h-6 text-orange-600 mr-3" />
              Generated Mehndi Design
            </h2>

            <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center border-2 border-orange-200 overflow-hidden relative">
              {generating ? (
                <div className="text-center p-6">
                  <Loader2 className="animate-spin w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">AI is creating your mehndi design...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full group">
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
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end justify-center p-4">
                    <div className="flex gap-2 w-full max-w-xs">
                      <button
                        onClick={() => handleDownloadImage(generatedImage, formData.theme || 'mehndi-design')}
                        disabled={downloading}
                        className="flex-1 bg-white text-orange-900 py-2 px-3 rounded font-bold text-xs uppercase tracking-wider shadow hover:bg-orange-50 transition flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Image
                      </button>
                      <button
                        onClick={() => handleDownloadSpec(formData.theme || 'Mehndi Design', formData)}
                        className="flex-1 bg-orange-900 text-white py-2 px-3 rounded font-bold text-xs uppercase tracking-wider shadow hover:bg-orange-800 transition flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 p-6">
                  <Hand className="w-16 h-16 mx-auto mb-4 text-orange-300" />
                  <p className="font-semibold text-gray-600">Your AI mehndi design will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Fill the form and click generate, or choose from popular Henna patterns below.</p>
                </div>
              )}
            </div>

            {/* Download Actions Bar for Mehndi */}
            {generatedImage && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-orange-700" /> Download Mehndi Options:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownloadImage(generatedImage, formData.theme || 'mehndi-design')}
                    disabled={downloading}
                    className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-orange-700 transition flex items-center justify-center gap-2"
                  >
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download Image (PNG)
                  </button>
                  <button
                    onClick={() => handleDownloadSpec(formData.theme || 'Mehndi Design', formData)}
                    className="w-full bg-white text-orange-700 border border-orange-300 py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-orange-100 transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    Download Artist Spec Sheet (TXT)
                  </button>
                </div>
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

      {/* Curated Mehndi Gallery & Ready Downloads */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🤏</span> Curated Henna Designs & Blueprints
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Browse master artist Henna motifs with instant image and artist spec sheet downloads.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full mt-3 sm:mt-0 w-fit">
            Ready to Download
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_MEHNDI.map((item) => (
            <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full">
                  <img
                    src={item.imageUrl}
                    alt={item.theme}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-orange-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {item.placement}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-gray-900 text-base">{item.theme}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="text-[11px] text-gray-500 pt-1 space-y-0.5">
                    <div><span className="font-semibold text-gray-700">Pattern:</span> {item.pattern}</div>
                    <div><span className="font-semibold text-gray-700">Style:</span> {item.designStyle}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => setFormData({
                    occasion: item.occasion,
                    designStyle: item.designStyle,
                    pattern: item.pattern,
                    placement: item.placement,
                    theme: item.theme,
                    complexity: item.complexity,
                    elements: item.elements,
                    specialMotifs: item.specialMotifs,
                  })}
                  className="w-full bg-orange-50 text-orange-700 hover:bg-orange-100 py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider transition"
                >
                  Use & Customize
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadImage(item.imageUrl, item.theme)}
                    className="w-full bg-white border border-orange-300 text-orange-800 hover:bg-orange-50 py-2 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Image
                  </button>
                  <button
                    onClick={() => handleDownloadSpec(item.theme, {
                      theme: item.theme,
                      occasion: item.occasion,
                      designStyle: item.designStyle,
                      pattern: item.pattern,
                      placement: item.placement,
                      complexity: item.complexity,
                      elements: item.elements,
                      specialMotifs: item.specialMotifs,
                    })}
                    className="w-full bg-orange-900 text-white hover:bg-orange-800 py-2 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> Artist Spec
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

